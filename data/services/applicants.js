/**
 * Applicants service — CRUD operations against the `applicants` Supabase table.
 *
 * Expected Supabase table schema (run in SQL Editor):
 *
 *   create table public.applicants (
 *     id            text primary key,
 *     first_name    text not null,
 *     last_name     text not null,
 *     phone         text,
 *     grade         text,
 *     exam_type     text default 'trial',
 *     score         integer,
 *     correct       integer,
 *     total         integer,
 *     elapsed       integer,
 *     lang          text,
 *     completed_at  timestamptz default now(),
 *     topics        jsonb,
 *     parent_phone  text,
 *     parent_name   text,
 *     attended      text
 *   );
 *
 *   -- Allow public inserts (students submitting results)
 *   alter table applicants enable row level security;
 *   create policy "allow_insert" on applicants for insert with check (true);
 *   create policy "allow_select" on applicants for select using (true);
 *   create policy "allow_delete" on applicants for delete using (true);
 */

import { supabase } from "./supabase.js";

const TABLE = "applicants";

/**
 * Save a completed exam result.
 * @param {Object} record  - { id, firstName, lastName, phone, grade, exam_type,
 *                            score, correct, total, elapsed, lang, completedAt, topics }
 * @returns {{ data, error }}
 */
export async function saveApplicant(record) {
  const { data, error } = await supabase.from(TABLE).insert({
    id:           record.id,
    first_name:   record.firstName,
    last_name:    record.lastName,
    phone:        record.phone,
    grade:        record.grade,
    exam_type:    record.examType || record.exam_type,
    score:        record.score,
    correct:      record.correct,
    total:        record.total,
    elapsed:      record.elapsed,
    lang:         record.lang,
    completed_at: record.completedAt,
    topics:       record.topics,
    parent_phone: record.parentPhone || null,
    parent_name:  record.parentName  || null,
    attended:     record.attended    || null,
  });
  return { data, error };
}

/**
 * Fetch all applicants ordered by newest first.
 * @returns {{ data: Array, error }}
 */
export async function getApplicants() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("id, first_name, last_name, phone, grade, exam_type, score, correct, total, elapsed, lang, completed_at, topics, parent_phone, parent_name, attended")
    .order("completed_at", { ascending: false });
  return { data: data ?? [], error };
}

/**
 * Delete a single applicant record by id.
 * @param {string} id
 * @returns {{ error }}
 */
export async function deleteApplicant(id) {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  return { error };
}

/**
 * Delete all applicant records.
 * @returns {{ error }}
 */
export async function clearApplicants() {
  const { error } = await supabase.from(TABLE).delete().neq("id", "");
  return { error };
}
