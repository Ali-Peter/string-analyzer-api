import db from "../db.js";
import { analyzeString } from "../utils/stringUtils.js";

export const createString = (req, res) => {
  const { value } = req.body;
  if (!value) return res.status(400).json({ error: 'Missing "value" field' });
  if (typeof value !== "string") return res.status(422).json({ error: '"value" must be a string' });

  const exists = db.prepare("SELECT * FROM strings WHERE value = ?").get(value);
  if (exists) return res.status(409).json({ error: "String already exists" });

  const result = analyzeString(value);

  db.prepare(`
    INSERT INTO strings (
      id, value, length, is_palindrome, unique_characters,
      word_count, sha256_hash, character_frequency_map, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    result.id,
    value,
    result.properties.length,
    result.properties.is_palindrome ? 1 : 0,
    result.properties.unique_characters,
    result.properties.word_count,
    result.properties.sha256_hash,
    JSON.stringify(result.properties.character_frequency_map),
    result.created_at
  );

  res.status(201).json(result);
};

export const getString = (req, res) => {
  const { string_value } = req.params;
  const row = db.prepare("SELECT * FROM strings WHERE value = ?").get(string_value);

  if (!row) return res.status(404).json({ error: "String not found" });

  row.character_frequency_map = JSON.parse(row.character_frequency_map);
  res.json(row);
};

export const getAllStrings = (req, res) => {
  const { is_palindrome, min_length, max_length, word_count, contains_character } = req.query;
  let query = "SELECT * FROM strings WHERE 1=1";
  const params = [];

  if (is_palindrome !== undefined) {
    query += " AND is_palindrome = ?";
    params.push(is_palindrome === "true" ? 1 : 0);
  }
  if (min_length) {
    query += " AND length >= ?";
    params.push(parseInt(min_length));
  }
  if (max_length) {
    query += " AND length <= ?";
    params.push(parseInt(max_length));
  }
  if (word_count) {
    query += " AND word_count = ?";
    params.push(parseInt(word_count));
  }

  const results = db.prepare(query).all(...params);
  const filtered = contains_character
    ? results.filter(r => r.value.includes(contains_character))
    : results;

  res.json({
    data: filtered.map(r => ({
      ...r,
      character_frequency_map: JSON.parse(r.character_frequency_map),
    })),
    count: filtered.length,
    filters_applied: req.query,
  });
};

export const deleteString = (req, res) => {
  const { string_value } = req.params;
  const row = db.prepare("SELECT * FROM strings WHERE value = ?").get(string_value);
  if (!row) return res.status(404).json({ error: "String not found" });

  db.prepare("DELETE FROM strings WHERE value = ?").run(string_value);
  res.status(204).send();
};



export const filterByNaturalLanguage = (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  const q = query.toLowerCase().trim();
  const results = db.prepare("SELECT * FROM strings").all();

  if (!results.length) {
    return res.status(404).json({ error: "No data found in database" });
  }

  let filtered = results;

  if (q.includes("palindrome") || q.includes("palindromic")) {
    filtered = filtered.filter(r => r.is_palindrome === 1 || r.is_palindrome === true);
  }

  if (q.includes("single word") || q.includes("one word")) {
    filtered = filtered.filter(r => r.word_count === 1);
  }

  // ✅ Multi-word strings
  if (q.includes("multi word") || q.includes("multiple words") || q.includes("more than one word")) {
    filtered = filtered.filter(r => r.word_count > 1);
  }

  if (q.includes("longer than")) {
    const number = parseInt(q.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(number)) {
      filtered = filtered.filter(r => r.length > number);
    }
  }

  if (q.includes("shorter than")) {
    const number = parseInt(q.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(number)) {
      filtered = filtered.filter(r => r.length < number);
    }
  }

  if (q.includes("containing the letter")) {
    const letter = q.split("letter").pop().trim().replace(/[^a-z]/gi, "").toLowerCase();
    if (letter) {
      filtered = filtered.filter(r => r.value.toLowerCase().includes(letter));
    }
  }

  if (q.includes("starting with")) {
    const letter = q.split("starting with").pop().trim().replace(/[^a-z]/gi, "").toLowerCase();
    if (letter) {
      filtered = filtered.filter(r => r.value.toLowerCase().startsWith(letter));
    }
  }

  // ✅ Ends with a specific letter
  if (q.includes("ending with")) {
    const letter = q.split("ending with").pop().trim().replace(/[^a-z]/gi, "").toLowerCase();
    if (letter) {
      filtered = filtered.filter(r => r.value.toLowerCase().endsWith(letter));
    }
  }

  // ✅ New rule: contains the first vowel
  if (q.includes("first vowel")) {
    filtered = filtered.filter(r => {
      const str = r.value.toLowerCase();
      const firstVowel = str.match(/[aeiou]/)?.[0];
      return firstVowel ? str.includes(firstVowel) : false;
    });
  }

  if (!filtered.length) {
    return res.status(404).json({ error: "No matching strings found" });
  }

  // ✅ Format final output (convert booleans and parse frequency map)
  const formatted = filtered.map(r => ({
    ...r,
    is_palindrome: !!r.is_palindrome,
    character_frequency_map: JSON.parse(r.character_frequency_map),
  }));

  res.json({
    data: formatted,
    count: formatted.length,
    query,
  });
};
