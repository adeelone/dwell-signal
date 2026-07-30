import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  DollarSign,
  ReceiptText,
  Search,
  Send,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Fragment, useMemo, useState, type FormEvent } from "react";
import { classifyRequest, rankTechnicians } from "../lib/routing";
import { readStored, writeStored } from "../lib/storage";
import { technicians } from "../portalData";
import type { Role, ServiceRequest, Trade } from "../types";

export function PortalHome({
  role,
  requests,
  setRequests,
}: {
  role: Role;
  requests: ServiceRequest[];
  setRequests: React.Dispatch<React.SetStateAction<ServiceRequest[]>>;
}) {
  if (role === "technician") return <TechnicianPortal requests={requests} setRequests={setRequests} />;
  if (role === "resident") return <ResidentPortal requests={requests} setRequests={setRequests} />;
  return <OwnerPortal requests={requests} setRequests={setRequests} />;
}

function OwnerPortal({
  requests,
  setRequests,
}: {
  requests: ServiceRequest[];
  setRequests: React.Dispatch<React.SetStateAction<ServiceRequest[]>>;
}) {
  const assign = (request: ServiceRequest) => {
    const match = rankTechnicians(request, technicians)[0];
    if (match)
      setRequests((items) =>
        items.map((item) =>
          item.id === request.id ? { ...item, assignedTechnician: match.name, status: "offered" } : item,
        ),
      );
  };
  const reassign = (requestId: string, technician: string) => {
    setRequests((items) =>
      items.map((item) =>
        item.id === requestId
          ? {
              ...item,
              assignedTechnician: technician || undefined,
              status: technician ? "offered" : "triage",
            }
          : item,
      ),
    );
  };
  const schedule = (requestId: string, slot: string) => {
    setRequests((items) =>
      items.map((item) =>
        item.id === requestId
          ? { ...item, scheduledSlot: slot || undefined, status: slot ? "scheduled" : "accepted" }
          : item,
      ),
    );
  };
  return (
    <>
      <div className="page-title">
        <div>
          <h1>Portfolio</h1>
          <p>Payments, maintenance, and resident activity across four properties.</p>
        </div>
        <span className="live">
          <i />
          Shared request lifecycle
        </span>
      </div>
      <div className="owner-metrics">
        <article>
          <div>
            <span>June rent collection</span>
            <strong>$148,230</strong>
            <small>of $175,000</small>
          </div>
          <div className="mini-ring">84.7%</div>
        </article>
        <article>
          <span>Payment reliability</span>
          <div className="reliability">
            <label>
              On track <b>68%</b>
            </label>
            <i>
              <em style={{ width: "68%" }} />
            </i>
            <label>
              Occasional delays <b>22%</b>
            </label>
            <i>
              <em className="blue" style={{ width: "22%" }} />
            </i>
            <label>
              Needs a conversation <b>10%</b>
            </label>
            <i>
              <em className="amber" style={{ width: "10%" }} />
            </i>
          </div>
        </article>
        <article>
          <span>Operating snapshot</span>
          <dl>
            <div>
              <dt>Open requests</dt>
              <dd>{requests.filter((r) => r.status !== "completed").length}</dd>
            </div>
            <div>
              <dt>Scheduled this week</dt>
              <dd>{requests.filter((r) => ["scheduled", "accepted"].includes(r.status)).length}</dd>
            </div>
            <div>
              <dt>Projected job cost</dt>
              <dd>${requests.reduce((sum, r) => sum + r.estimatedPay, 0)}</dd>
            </div>
          </dl>
        </article>
      </div>
      <section className="portal-panel">
        <div className="section-heading">
          <div>
            <h2>Open maintenance requests</h2>
            <p>Resident request → routing assistant → qualified technician → shared status updates</p>
          </div>
          <button className="secondary">
            <Search />
            Search
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Request</th>
                <th>Property / resident</th>
                <th>Routing</th>
                <th>Resident availability</th>
                <th>Technician</th>
                <th>Scheduled time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => {
                const qualified = technicians.filter((technician) =>
                  technician.trades.includes(request.trade),
                );
                return (
                  <tr key={request.id}>
                    <td>
                      <b>#{request.id}</b>
                      <span>{request.summary}</span>
                    </td>
                    <td>
                      <b>
                        {request.property} · {request.unit}
                      </b>
                      <span>
                        {request.resident} · {request.responsibility} responsibility
                      </span>
                    </td>
                    <td>
                      <strong>{request.trade}</strong>
                      <span>{request.confidence}% confidence</span>
                    </td>
                    <td>{request.availability.join(", ") || "No access window yet"}</td>
                    <td>
                      <label className="sr-only" htmlFor={`assign-${request.id}`}>
                        Assign request {request.id}
                      </label>
                      <select
                        id={`assign-${request.id}`}
                        value={request.assignedTechnician ?? ""}
                        onChange={(event) => reassign(request.id, event.target.value)}
                      >
                        <option value="">Unassigned</option>
                        {qualified.map((technician) => (
                          <option key={technician.id}>{technician.name}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <label className="sr-only" htmlFor={`schedule-${request.id}`}>
                        Schedule request {request.id}
                      </label>
                      <select
                        id={`schedule-${request.id}`}
                        value={request.scheduledSlot ?? ""}
                        disabled={!request.assignedTechnician}
                        onChange={(event) => schedule(request.id, event.target.value)}
                      >
                        <option value="">Not scheduled</option>
                        {request.availability.map((slot) => (
                          <option key={slot}>{slot}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <span className={`status status-${request.status}`}>{request.status}</span>
                    </td>
                    <td>
                      {!request.assignedTechnician && (
                        <button className="secondary" onClick={() => assign(request)}>
                          Best match
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      <Schedule requests={requests} />
    </>
  );
}

function TechnicianPortal({
  requests,
  setRequests,
}: {
  requests: ServiceRequest[];
  setRequests: React.Dispatch<React.SetStateAction<ServiceRequest[]>>;
}) {
  const [trade, setTrade] = useState<Trade>("HVAC");
  const person = technicians.find((t) => t.trades.includes(trade)) ?? technicians[0];
  const jobs = requests.filter((r) => r.trade === trade || r.assignedTechnician === person.name);
  const advance = (id: string, status: ServiceRequest["status"]) =>
    setRequests((items) =>
      items.map((request) =>
        request.id === id
          ? {
              ...request,
              assignedTechnician: person.name,
              scheduledSlot:
                status === "scheduled"
                  ? (request.availability.find((slot) => person.available.includes(slot)) ??
                    request.availability[0])
                  : request.scheduledSlot,
              status,
            }
          : request,
      ),
    );
  return (
    <>
      <div className="page-title">
        <div>
          <h1>{person.name}’s workbench</h1>
          <p>
            Qualified for {person.trades.join(", ")} · {person.rating} average rating
          </p>
        </div>
        <div className="trade-select">
          <label>
            View trade
            <select value={trade} onChange={(e) => setTrade(e.target.value as Trade)}>
              {(
                [
                  "HVAC",
                  "Plumbing",
                  "Electrical",
                  "Appliance",
                  "General repair",
                  "Inspection",
                  "Landscaping",
                  "Pest control",
                  "Locksmith",
                  "Life safety",
                ] as Trade[]
              ).map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="technician-metrics">
        <article>
          <DollarSign />
          <div>
            <span>Available earnings</span>
            <strong>
              ${jobs.filter((j) => j.status !== "completed").reduce((s, j) => s + j.estimatedPay, 0)}
            </strong>
          </div>
        </article>
        <article>
          <Wrench />
          <div>
            <span>Active jobs</span>
            <strong>{jobs.filter((j) => !["triage", "completed"].includes(j.status)).length}</strong>
          </div>
        </article>
        <article>
          <CalendarDays />
          <div>
            <span>Open availability</span>
            <strong>{person.available.length} windows</strong>
          </div>
        </article>
      </div>
      <section className="portal-panel">
        <div className="section-heading">
          <div>
            <h2>Qualified job queue</h2>
            <p>Only requests matching the selected trade and your qualifications appear here.</p>
          </div>
        </div>
        {jobs.length ? (
          <div className="job-grid">
            {jobs.map((job) => (
              <article key={job.id}>
                <div>
                  <span>
                    #{job.id} · {job.property}
                  </span>
                  <b>${job.estimatedPay}</b>
                </div>
                <h3>{job.summary}</h3>
                <p>{job.details}</p>
                <dl>
                  <div>
                    <dt>Resident windows</dt>
                    <dd>{job.scheduledSlot ?? (job.availability.join(", ") || "Contact resident")}</dd>
                  </div>
                  <div>
                    <dt>Responsibility</dt>
                    <dd>{job.responsibility}</dd>
                  </div>
                </dl>
                <div className="job-actions">
                  <span className={`status status-${job.status}`}>{job.status}</span>
                  {["triage", "offered"].includes(job.status) && (
                    <button className="primary" onClick={() => advance(job.id, "accepted")}>
                      Accept job
                    </button>
                  )}
                  {job.status === "accepted" && (
                    <button className="primary" onClick={() => advance(job.id, "scheduled")}>
                      Add to calendar
                    </button>
                  )}
                  {job.status === "scheduled" && (
                    <button className="primary" onClick={() => advance(job.id, "in-progress")}>
                      Start work
                    </button>
                  )}
                  {job.status === "in-progress" && (
                    <button className="primary" onClick={() => advance(job.id, "completed")}>
                      Mark complete
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty">
            <Wrench />
            <b>No matching jobs</b>
            <span>Change the trade filter or check back when a new request arrives.</span>
          </div>
        )}
      </section>
      <Schedule requests={jobs} />
    </>
  );
}

function ResidentPortal({
  requests,
  setRequests,
}: {
  requests: ServiceRequest[];
  setRequests: React.Dispatch<React.SetStateAction<ServiceRequest[]>>;
}) {
  const mine = requests.filter((r) => r.resident === "Nadia Torres");
  const [draft, setDraft] = useState("");
  const [paid, setPaid] = useState(() => readStored("resident-payment", false));
  const [ledgerOpen, setLedgerOpen] = useState(false);
  const classified = useMemo(() => classifyRequest(draft), [draft]);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (draft.trim().length < 12) return;
    const availability = Array.from(
      new FormData(e.currentTarget as HTMLFormElement).getAll("availability"),
      String,
    );
    setRequests((items) => [
      {
        id: String(Date.now()).slice(-5),
        resident: "Nadia Torres",
        unit: "204",
        property: "Northfield Lofts",
        summary: draft.slice(0, 42),
        details: draft,
        trade: classified.trade,
        confidence: classified.confidence,
        responsibility: "review",
        availability,
        preferredTechnician:
          String(new FormData(e.currentTarget as HTMLFormElement).get("preferred") || "") || undefined,
        status: "triage",
        estimatedPay: 100,
      },
      ...items,
    ]);
    setDraft("");
  };
  return (
    <>
      <div className="page-title">
        <div>
          <h1>Welcome back, Nadia</h1>
          <p>Northfield Lofts · Unit 204</p>
        </div>
        <span className="live">
          <i />
          Account current
        </span>
      </div>
      <div className="resident-top">
        <article>
          <CreditCard />
          <div>
            <span>July balance</span>
            <strong>{paid ? "$0.00" : "$1,650.00"}</strong>
            <small>{paid ? "Demo payment recorded" : "Due July 1"}</small>
          </div>
          <button
            className="primary"
            disabled={paid}
            onClick={() => {
              setPaid(true);
              writeStored("resident-payment", true);
              setLedgerOpen(true);
            }}
          >
            {paid ? "Paid in demo" : "Record demo payment"}
          </button>
        </article>
        <article>
          <CheckCircle2 />
          <div>
            <span>Payment history</span>
            <strong>{paid ? "13 on-time payments" : "12 on-time payments"}</strong>
            <small>Demo receipts stay in this browser</small>
          </div>
          <button className="secondary" onClick={() => setLedgerOpen((open) => !open)}>
            {ledgerOpen ? "Hide ledger" : "View ledger"}
          </button>
        </article>
      </div>
      {ledgerOpen && (
        <section className="payment-receipt" aria-live="polite">
          <ReceiptText />
          <div>
            <b>Demo receipt · July rent</b>
            <span>$1,650.00 · Recorded locally · No money moved</span>
          </div>
        </section>
      )}
      <div className="resident-layout">
        <form className="request-form" onSubmit={submit}>
          <div className="section-heading">
            <div>
              <h2>Request maintenance</h2>
              <p>
                Describe what is happening. The routing assistant suggests a trade; a property manager
                confirms assignment.
              </p>
            </div>
            <Sparkles />
          </div>
          <label>
            What needs attention?
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              minLength={12}
              required
              placeholder="For example: The kitchen faucet has been leaking under the handle since yesterday."
            />
          </label>
          {draft && (
            <div className="ai-routing">
              <Sparkles />
              <div>
                <span>Suggested routing</span>
                <strong>{classified.trade}</strong>
                <small>{classified.confidence}% confidence · a manager can correct this</small>
              </div>
            </div>
          )}
          <fieldset>
            <legend>When can a technician enter?</legend>
            {["Mon 9–1", "Mon 1–5", "Tue 8–12", "Tue 1–5", "Wed 2–6"].map((slot) => (
              <label key={slot}>
                <input type="checkbox" name="availability" value={slot} />
                {slot}
              </label>
            ))}
          </fieldset>
          <label>
            Preferred technician (optional)
            <select name="preferred">
              <option value="">No preference</option>
              {technicians.map((t) => (
                <option key={t.id}>{t.name}</option>
              ))}
            </select>
            <small>
              We prioritize this person only when qualified and available. This does not assign them directly.
            </small>
          </label>
          <button className="primary">
            <Send />
            Send request
          </button>
        </form>
        <section className="my-requests">
          <h2>My requests</h2>
          {mine.map((r) => (
            <article key={r.id}>
              <div>
                <strong>
                  #{r.id} · {r.summary}
                </strong>
                <span className={`status status-${r.status}`}>{r.status}</span>
              </div>
              <p>
                {r.trade} ·{" "}
                {r.assignedTechnician ? `Assigned to ${r.assignedTechnician}` : "Awaiting property review"}
              </p>
              <div className="timeline">
                {["triage", "offered", "accepted", "scheduled", "in-progress", "completed"].map((s) => (
                  <i key={s} className={s === r.status ? "current" : ""} title={s} />
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </>
  );
}

function Schedule({ requests }: { requests: ServiceRequest[] }) {
  const days = ["Mon 9", "Tue 10", "Wed 11", "Thu 12", "Fri 13"];
  return (
    <section className="schedule">
      <div className="section-heading">
        <div>
          <h2>Dispatch calendar</h2>
          <p>Accepted work can be moved into an available resident window.</p>
        </div>
        <button className="secondary">
          <CalendarDays />
          This week
        </button>
      </div>
      <div className="calendar-grid">
        <div />
        {days.map((d) => (
          <b key={d}>{d}</b>
        ))}
        {technicians.slice(0, 4).map((tech, row) => (
          <Fragment key={tech.id}>
            <strong>
              {tech.name}
              <small>{tech.trades[0]}</small>
            </strong>
            {days.map((day, col) => {
              const request = requests[(row + col) % requests.length];
              return (
                <div key={`${tech.id}-${day}`}>
                  {request?.scheduledSlot && (row + col) % 3 === 0 && (
                    <span>
                      {request.summary}
                      <small>{request.scheduledSlot}</small>
                    </span>
                  )}
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>
    </section>
  );
}
