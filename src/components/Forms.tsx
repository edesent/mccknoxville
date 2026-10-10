"use client";

import { useState } from "react";
import { useForm } from "./useFormToken";

function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

function Sent({ children }: { children: React.ReactNode }) {
  return (
    <div role="status" className="rounded-[1.5rem] bg-r4/10 p-6 text-lg font-semibold text-[#1d6b47]">
      {children}
    </div>
  );
}

function Err({ error }: { error: string }) {
  return (
    <p role="alert" className="rounded-2xl bg-r1/10 px-5 py-4 font-medium text-[#b02a43]">
      {error}
    </p>
  );
}

const data = (form: HTMLFormElement) => Object.fromEntries(new FormData(form).entries());
const label = "mb-1.5 block text-sm font-bold text-ink/80";
const chip =
  "inline-block rounded-full border-[1.5px] border-ink/15 bg-white px-4 py-2 text-sm font-semibold transition peer-checked:border-plum peer-checked:bg-plum peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-plum/20";

/** "I'm coming Sunday" — lets the church watch for a newcomer and say hello. */
export function VisitForm() {
  const { submit, status, error } = useForm("visit");
  const [party, setParty] = useState(1);
  if (status === "sent")
    return <Sent>Wonderful. We’ll be watching for you. Someone will reach out before Sunday to say hello.</Sent>;
  return (
    <form
      className="relative grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const f = e.currentTarget;
        submit({ ...data(f), needs: new FormData(f).getAll("needs"), party });
      }}
    >
      <Honeypot />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="v-name">Your name</label>
          <input id="v-name" name="name" required className="field" autoComplete="name" placeholder="First and last" />
        </div>
        <div>
          <label className={label} htmlFor="v-contact">Phone or email</label>
          <input id="v-contact" name="contact" required className="field" placeholder="So we can say hello" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="v-when">Which Sunday?</label>
          <input id="v-when" name="when" className="field" placeholder="This Sunday…" />
        </div>
        <div>
          <span className={label}>How many of you?</span>
          <div className="flex items-center gap-3">
            <button type="button" className="grid h-12 w-12 place-items-center rounded-full border-[1.5px] border-ink/15 bg-white text-xl" onClick={() => setParty((p) => Math.max(1, p - 1))} aria-label="One fewer">−</button>
            <span className="w-10 text-center text-2xl font-extrabold tabular-nums" aria-live="polite">{party}</span>
            <button type="button" className="grid h-12 w-12 place-items-center rounded-full border-[1.5px] border-ink/15 bg-white text-xl" onClick={() => setParty((p) => Math.min(20, p + 1))} aria-label="One more">+</button>
          </div>
        </div>
      </div>
      <fieldset>
        <legend className={label}>Anything that would help? (optional)</legend>
        <div className="flex flex-wrap gap-2">
          {["Joining on Zoom", "Bringing children", "Wheelchair access", "I’d like to meet a pastor"].map((o) => (
            <label key={o} className="cursor-pointer">
              <input type="checkbox" name="needs" value={o} className="peer sr-only" />
              <span className={chip}>{o}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {status === "error" && <Err error={error} />}
      <button type="submit" disabled={status === "sending"} className="btn btn-ember justify-center disabled:opacity-60 sm:justify-self-start">
        {status === "sending" ? "Sending…" : "Let them know I’m coming"}
      </button>
    </form>
  );
}

export function PrayerForm() {
  const { submit, status, error } = useForm("prayer");
  if (status === "sent")
    return <Sent>Thank you. Your request is with our pastors and prayer team, and we’re holding you in prayer.</Sent>;
  return (
    <form
      className="relative grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const f = e.currentTarget;
        submit({ ...data(f), share: new FormData(f).get("share") === "on" });
      }}
    >
      <Honeypot />
      <div>
        <label className={label} htmlFor="p-req">How can we pray for you?</label>
        <textarea id="p-req" name="request" required rows={6} className="field" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="p-name">Your name (optional)</label>
          <input id="p-name" name="name" className="field" autoComplete="name" />
        </div>
        <div>
          <label className={label} htmlFor="p-contact">Phone or email (optional)</label>
          <input id="p-contact" name="contact" className="field" placeholder="If you’d like a call back" />
        </div>
      </div>
      <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-mist p-4">
        <input type="checkbox" name="share" className="mt-1 h-5 w-5 accent-plum" />
        <span>
          <span className="font-bold">Share this with the whole congregation</span>
          <span className="block text-sm text-muted">
            It’ll go in the weekly email. Send by Wednesday 5 PM to make that week’s. Leave unchecked and only the
            pastors and prayer team will see it.
          </span>
        </span>
      </label>
      {status === "error" && <Err error={error} />}
      <button type="submit" disabled={status === "sending"} className="btn btn-ember justify-center disabled:opacity-60 sm:justify-self-start">
        {status === "sending" ? "Sending…" : "Send my prayer request"}
      </button>
    </form>
  );
}

const topics = [
  "Just saying hello",
  "Pastoral care",
  "Membership",
  "Children’s ministry",
  "Music ministry",
  "Food Pantry",
  "Something for the calendar",
  "Something for the weekly email",
  "The Board",
  "The website",
];

export function ContactForm() {
  const { submit, status, error } = useForm("contact");
  if (status === "sent") return <Sent>Thanks for reaching out. Someone from MCC Knoxville will get back to you soon.</Sent>;
  return (
    <form
      className="relative grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        submit(data(e.currentTarget));
      }}
    >
      <Honeypot />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="c-name">Your name</label>
          <input id="c-name" name="name" required className="field" autoComplete="name" placeholder="First and last" />
        </div>
        <div>
          <label className={label} htmlFor="c-contact">Phone or email</label>
          <input id="c-contact" name="contact" required className="field" />
        </div>
      </div>
      <div>
        <label className={label} htmlFor="c-topic">What’s it about?</label>
        <select id="c-topic" name="topic" className="field">
          {topics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={label} htmlFor="c-msg">Message</label>
        <textarea id="c-msg" name="message" required rows={6} className="field" />
      </div>
      {status === "error" && <Err error={error} />}
      <button type="submit" disabled={status === "sending"} className="btn btn-ember justify-center disabled:opacity-60 sm:justify-self-start">
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
