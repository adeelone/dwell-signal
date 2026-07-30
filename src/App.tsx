import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleGauge,
  ClipboardPlus,
  Download,
  Search,
  Wind,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Shell } from "./components/Shell";
import { Sparkline } from "./components/Sparkline";
import { defaultSettings, initialAlerts, initialWorkOrders, residentRequests, zones } from "./data";
import { comfortScore, comfortSeverity } from "./lib/comfort";
import { clearStored, readStored, writeStored } from "./lib/storage";
import type { Alert, NavKey, Settings, WorkOrder } from "./types";
import type { Role, ServiceRequest } from "./types";
import { PortalHome } from "./features/Portals";
import { initialRequests } from "./portalData";

function Status({ value }: { value: string }) {
  return <span className={`status status-${value}`}>{value.replace("-", " ")}</span>;
}

export default function App() {
  const [active, setActive] = useState<NavKey>("overview");
  const [role, setRole] = useState<Role>("owner");
  const [requests, setRequests] = useState<ServiceRequest[]>(() =>
    readStored("dwell-requests", initialRequests),
  );
  const [alerts, setAlerts] = useState(() => readStored("dwell-alerts", initialAlerts));
  const [orders, setOrders] = useState(() => readStored("dwell-orders", initialWorkOrders));
  const [settings, setSettings] = useState(() => readStored("dwell-settings", defaultSettings));
  const [dialog, setDialog] = useState<"order" | Alert | null>(null);
  useEffect(() => writeStored("dwell-alerts", alerts), [alerts]);
  useEffect(() => writeStored("dwell-orders", orders), [orders]);
  useEffect(() => writeStored("dwell-settings", settings), [settings]);
  useEffect(() => writeStored("dwell-requests", requests), [requests]);

  const openAlerts = alerts.filter((alert) => alert.status !== "resolved");
  const openOrders = orders.filter((order) => order.status !== "done");
  const createFromAlert = (alert: Alert) => {
    if (!orders.some((order) => order.sourceAlertId === alert.id)) {
      setOrders((current) => [
        {
          id: String(1259 + current.length),
          title: `Investigate ${alert.title}`,
          location: alert.title,
          priority: alert.severity === "critical" ? "high" : "medium",
          status: "open",
          assignee: "Unassigned",
          createdAt: "Just now",
          sourceAlertId: alert.id,
        },
        ...current,
      ]);
    }
    setAlerts((current) =>
      current.map((item) => (item.id === alert.id ? { ...item, status: "acknowledged" } : item)),
    );
    setDialog(null);
  };
  const resetDemo = () => {
    clearStored();
    setRequests(initialRequests);
    setAlerts(initialAlerts);
    setOrders(initialWorkOrders);
    setSettings(defaultSettings);
    setRole("owner");
    setActive("overview");
  };

  return (
    <Shell
      active={active}
      onNavigate={setActive}
      alertCount={openAlerts.length}
      workOrderCount={openOrders.length}
      buildingName={settings.buildingName}
      role={role}
      onRoleChange={(next) => {
        setRole(next);
        setActive("overview");
      }}
    >
      {active === "overview" && <PortalHome role={role} requests={requests} setRequests={setRequests} />}
      {active === "spaces" && <Spaces />}
      {active === "alerts" && (
        <AlertsPage
          alerts={alerts}
          onReview={setDialog}
          onResolve={(id) =>
            setAlerts((items) => items.map((a) => (a.id === id ? { ...a, status: "resolved" } : a)))
          }
        />
      )}
      {active === "work-orders" && (
        <OrdersPage
          orders={orders}
          onNew={() => setDialog("order")}
          onAdvance={(id) =>
            setOrders((items) =>
              items.map((order) =>
                order.id === id
                  ? { ...order, status: order.status === "open" ? "scheduled" : "done" }
                  : order,
              ),
            )
          }
        />
      )}
      {active === "residents" && <Residents />}
      {active === "reports" && <Reports alerts={alerts} orders={orders} />}
      {active === "settings" && <SettingsPage value={settings} onChange={setSettings} onReset={resetDemo} />}
      {dialog === "order" && (
        <OrderDialog
          onClose={() => setDialog(null)}
          onSubmit={(order) => {
            setOrders((items) => [order, ...items]);
            setDialog(null);
          }}
        />
      )}
      {dialog && dialog !== "order" && (
        <AlertDialog
          alert={dialog}
          orderExists={orders.some((order) => order.sourceAlertId === dialog.id)}
          onClose={() => setDialog(null)}
          onCreate={() => createFromAlert(dialog)}
        />
      )}
    </Shell>
  );
}

export function Overview({
  alerts,
  orders,
  onAlert,
  onNewOrder,
}: {
  alerts: Alert[];
  orders: WorkOrder[];
  onAlert: (alert: Alert) => void;
  onNewOrder: () => void;
}) {
  const score = comfortScore(zones);
  return (
    <>
      <div className="page-title">
        <div>
          <h1>Building comfort</h1>
          <p>Live operational picture for Riverside Commons</p>
        </div>
        <span className="live">
          <i />
          Updated just now
        </span>
      </div>
      <section className="overview-grid">
        <div className="overview-main">
          <div className="comfort-row">
            <div className="score-block">
              <div className="score-ring" style={{ "--score": `${score * 3.6}deg` } as React.CSSProperties}>
                <div>
                  <Wind />
                  <strong>{score}</strong>
                  <span>Good</span>
                </div>
              </div>
              <div>
                <h2>Comfort is good</h2>
                <p>Most spaces are within their expected range.</p>
                <dl>
                  <div>
                    <dt>
                      <i className="dot teal" />
                      Within range
                    </dt>
                    <dd>71%</dd>
                  </div>
                  <div>
                    <dt>
                      <i className="dot amber" />
                      Out of range
                    </dt>
                    <dd>21%</dd>
                  </div>
                  <div>
                    <dt>
                      <i className="dot coral" />
                      Critical
                    </dt>
                    <dd>8%</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="trend">
              <div className="section-heading">
                <h2>Temperature trend</h2>
                <span>24 hours</span>
              </div>
              <svg
                viewBox="0 0 560 220"
                role="img"
                aria-label="Indoor temperature and outdoor temperature trend over 24 hours"
              >
                <defs>
                  <pattern id="grid" width="70" height="44" patternUnits="userSpaceOnUse">
                    <path d="M 70 0 L 0 0 0 44" fill="none" stroke="#e5eaec" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="560" height="220" fill="url(#grid)" />
                <polyline
                  points="0,90 45,85 90,72 135,78 180,76 225,82 270,88 315,105 360,112 405,118 450,116 505,120 560,114"
                  fill="none"
                  stroke="#087f83"
                  strokeWidth="4"
                />
                <polyline
                  points="0,132 45,120 90,116 135,128 180,145 225,150 270,157 315,166 360,176 405,182 450,194 505,199 560,196"
                  fill="none"
                  stroke="#9aa8b2"
                  strokeWidth="3"
                  strokeDasharray="8 7"
                />
              </svg>
              <div className="legend">
                <span>
                  <i className="line teal" />
                  Indoor avg 74.3°
                </span>
                <span>
                  <i className="line gray" />
                  Outdoor 61.2°
                </span>
              </div>
            </div>
          </div>
          <ZoneTable onNewOrder={onNewOrder} />
        </div>
        <aside className="activity-rail">
          <div className="rail-section">
            <div className="section-heading">
              <h2>
                Alerts <b>{alerts.length}</b>
              </h2>
              <button>View all</button>
            </div>
            {alerts.slice(0, 4).map((alert) => (
              <AlertCard key={alert.id} alert={alert} onReview={() => onAlert(alert)} />
            ))}
          </div>
          <div className="rail-section">
            <div className="section-heading">
              <h2>
                Work orders <b>{orders.length}</b>
              </h2>
              <button>View all</button>
            </div>
            {orders.slice(0, 4).map((order) => (
              <div className={`order-row severity-${order.priority}`} key={order.id}>
                <b>#{order.id}</b>
                <div>
                  <strong>{order.location}</strong>
                  <span>{order.title}</span>
                </div>
                <div>
                  <em>{order.priority}</em>
                  <span>{order.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </>
  );
}

function ZoneTable({ onNewOrder }: { onNewOrder: () => void }) {
  const [query, setQuery] = useState("");
  const visible = zones.filter((zone) =>
    `${zone.floor} ${zone.name} ${zone.type}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section className="zones-section">
      <div className="section-heading">
        <div>
          <h2>Zones overview</h2>
          <p>Comfort and occupancy across monitored spaces</p>
        </div>
        <label className="search">
          <Search />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search zones"
            aria-label="Search zones"
          />
        </label>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Floor / zone</th>
              <th>Type</th>
              <th>Temperature</th>
              <th>Setpoint</th>
              <th>Occupancy</th>
              <th>Trend</th>
              <th>Comfort</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((zone) => {
              const severity = comfortSeverity(zone);
              return (
                <tr key={zone.id} className={`zone-${severity}`}>
                  <td>
                    <b>{zone.floor}</b>
                    <span>{zone.name}</span>
                  </td>
                  <td>{zone.type}</td>
                  <td>
                    <strong>{zone.temperature.toFixed(1)}°</strong>
                  </td>
                  <td>{zone.setpoint.toFixed(1)}°</td>
                  <td>{zone.occupancy ? `${zone.occupancy}%` : "Unoccupied"}</td>
                  <td>
                    <Sparkline values={zone.trend} label={`${zone.name} temperature trend`} />
                  </td>
                  <td>
                    <Status
                      value={
                        severity === "info" ? "good" : severity === "attention" ? "out-of-range" : "critical"
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!visible.length && <div className="empty">No zones match “{query}”.</div>}
      <button className="primary" onClick={onNewOrder}>
        <ClipboardPlus />
        Create work order
      </button>
    </section>
  );
}

function AlertCard({ alert, onReview }: { alert: Alert; onReview: () => void }) {
  return (
    <article className={`alert-card severity-${alert.severity}`}>
      <AlertTriangle />
      <div>
        <div className="alert-top">
          <strong>{alert.title}</strong>
          <time>{alert.detectedAt}</time>
        </div>
        <p>{alert.reason}</p>
        <button className="secondary" onClick={onReview}>
          Review alert <ArrowRight />
        </button>
      </div>
    </article>
  );
}

function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-title">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

function Spaces() {
  const [filter, setFilter] = useState("all");
  const visible = zones.filter((z) => filter === "all" || comfortSeverity(z) === filter);
  return (
    <>
      <PageHeader
        title="Spaces"
        description="Current readings for every monitored zone."
        action={
          <div className="segmented">
            <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
              All
            </button>
            <button className={filter === "critical" ? "active" : ""} onClick={() => setFilter("critical")}>
              Critical
            </button>
            <button className={filter === "attention" ? "active" : ""} onClick={() => setFilter("attention")}>
              Attention
            </button>
          </div>
        }
      />
      <div className="space-grid">
        {visible.map((z) => (
          <article className={`space-card severity-${comfortSeverity(z)}`} key={z.id}>
            <div>
              <span>{z.floor}</span>
              <Status value={comfortSeverity(z)} />
            </div>
            <h2>{z.name}</h2>
            <strong>{z.temperature.toFixed(1)}°F</strong>
            <p>
              Set to {z.setpoint}° · {z.humidity}% humidity
            </p>
            <Sparkline values={z.trend} label={`${z.name} trend`} />
          </article>
        ))}
      </div>
    </>
  );
}

function AlertsPage({
  alerts,
  onReview,
  onResolve,
}: {
  alerts: Alert[];
  onReview: (a: Alert) => void;
  onResolve: (id: string) => void;
}) {
  return (
    <>
      <PageHeader
        title="Alerts"
        description="Signals are ranked by impact and explained in plain language."
      />
      <div className="list-panel">
        {alerts.map((alert) => (
          <div className={`list-row severity-${alert.severity}`} key={alert.id}>
            <AlertTriangle />
            <div>
              <h2>{alert.title}</h2>
              <p>{alert.reason}</p>
            </div>
            <time>{alert.detectedAt}</time>
            <Status value={alert.status} />
            <button className="secondary" onClick={() => onReview(alert)}>
              Review
            </button>
            {alert.status !== "resolved" && (
              <button
                className="icon-button"
                onClick={() => onResolve(alert.id)}
                aria-label={`Resolve ${alert.title}`}
              >
                <Check />
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function OrdersPage({
  orders,
  onNew,
  onAdvance,
}: {
  orders: WorkOrder[];
  onNew: () => void;
  onAdvance: (id: string) => void;
}) {
  return (
    <>
      <PageHeader
        title="Work orders"
        description="Track maintenance from first signal to completed repair."
        action={
          <button className="primary" onClick={onNew}>
            <ClipboardPlus />
            Create work order
          </button>
        }
      />
      <div className="list-panel">
        {orders.map((order) => (
          <div className={`list-row severity-${order.priority}`} key={order.id}>
            <b>#{order.id}</b>
            <div>
              <h2>{order.title}</h2>
              <p>
                {order.location} · {order.assignee}
              </p>
            </div>
            <Status value={order.priority} />
            <Status value={order.status} />
            {order.status !== "done" && (
              <button className="secondary" onClick={() => onAdvance(order.id)}>
                {order.status === "open" ? "Schedule" : "Complete"}
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function Residents() {
  const [requests, setRequests] = useState(residentRequests);
  return (
    <>
      <PageHeader
        title="Resident requests"
        description="A focused inbox for comfort and maintenance reports."
      />
      <div className="inbox-layout">
        <div className="list-panel">
          {requests.map((request) => (
            <article className="request" key={request.id}>
              <div className="avatar">
                {request.resident
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <div>
                  <h2>{request.resident}</h2>
                  <span>
                    Unit {request.unit} · {request.createdAt}
                  </span>
                </div>
                <p>{request.message}</p>
                <Status value={request.status} />
                {request.status !== "closed" && (
                  <button
                    className="secondary"
                    onClick={() =>
                      setRequests((items) =>
                        items.map((r) =>
                          r.id === request.id
                            ? { ...r, status: r.status === "new" ? "in-review" : "closed" }
                            : r,
                        ),
                      )
                    }
                  >
                    {request.status === "new" ? "Start review" : "Close request"}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
        <aside className="plain-aside">
          <CircleGauge />
          <h2>Response context</h2>
          <p>
            Resident messages stay attached to their space, so technicians see the report next to sensor
            readings.
          </p>
          <dl>
            <div>
              <dt>New requests</dt>
              <dd>{requests.filter((r) => r.status === "new").length}</dd>
            </div>
            <div>
              <dt>In review</dt>
              <dd>{requests.filter((r) => r.status === "in-review").length}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </>
  );
}

function Reports({ alerts, orders }: { alerts: Alert[]; orders: WorkOrder[] }) {
  const download = () => {
    const rows = [
      "type,id,status,description",
      ...alerts.map((a) => `alert,${a.id},${a.status},"${a.title}"`),
      ...orders.map((o) => `work-order,${o.id},${o.status},"${o.title}"`),
    ];
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" }));
    link.download = "dwell-signal-report.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };
  return (
    <>
      <PageHeader
        title="Reports"
        description="Simple operational summaries you can inspect and export."
        action={
          <button className="primary" onClick={download}>
            <Download />
            Export CSV
          </button>
        }
      />
      <div className="report-grid">
        <article>
          <span>Comfort score</span>
          <strong>{comfortScore(zones)}</strong>
          <p>Across {zones.length} monitored zones</p>
        </article>
        <article>
          <span>Open alerts</span>
          <strong>{alerts.filter((a) => a.status !== "resolved").length}</strong>
          <p>
            {alerts.filter((a) => a.severity === "critical" && a.status !== "resolved").length} need immediate
            attention
          </p>
        </article>
        <article>
          <span>Completion rate</span>
          <strong>
            {Math.round(
              (orders.filter((o) => o.status === "done").length / Math.max(orders.length, 1)) * 100,
            )}
            %
          </strong>
          <p>
            {orders.filter((o) => o.status === "done").length} of {orders.length} orders completed
          </p>
        </article>
      </div>
      <section className="report-chart">
        <h2>Seven-day comfort trend</h2>
        <div className="bars">
          {[76, 82, 79, 86, 84, 88, 87].map((v, i) => (
            <div key={i}>
              <span style={{ height: `${v}%` }} />
              <b>{["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"][i]}</b>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function SettingsPage({
  value,
  onChange,
  onReset,
}: {
  value: Settings;
  onChange: (v: Settings) => void;
  onReset: () => void;
}) {
  return (
    <>
      <PageHeader title="Settings" description="Tune the local demo to match how your building operates." />
      <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
        <label>
          Building name
          <input
            value={value.buildingName}
            onChange={(e) => onChange({ ...value, buildingName: e.target.value })}
          />
        </label>
        <div className="field-row">
          <label>
            Comfort minimum
            <input
              type="number"
              min="55"
              max="75"
              value={value.comfortLow}
              onChange={(e) => onChange({ ...value, comfortLow: Number(e.target.value) })}
            />
          </label>
          <label>
            Comfort maximum
            <input
              type="number"
              min="65"
              max="85"
              value={value.comfortHigh}
              onChange={(e) => onChange({ ...value, comfortHigh: Number(e.target.value) })}
            />
          </label>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={value.notifications}
            onChange={(e) => onChange({ ...value, notifications: e.target.checked })}
          />
          <span />
          <div>
            <b>Browser notifications</b>
            <small>Only used after you grant permission. No data leaves this device.</small>
          </div>
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={value.reducedMotion}
            onChange={(e) => onChange({ ...value, reducedMotion: e.target.checked })}
          />
          <span />
          <div>
            <b>Reduce motion</b>
            <small>Keep transitions minimal throughout the interface.</small>
          </div>
        </label>
        <p className="saved">
          <CheckCircle2 />
          Changes save automatically in this browser.
        </p>
        <div className="danger-zone">
          <div>
            <b>Reset demo data</b>
            <span>Restore the original requests, work orders, payments, and settings.</span>
          </div>
          <button type="button" className="secondary" onClick={onReset}>
            Reset demo
          </button>
        </div>
      </form>
    </>
  );
}

function AlertDialog({
  alert,
  orderExists,
  onClose,
  onCreate,
}: {
  alert: Alert;
  orderExists: boolean;
  onClose: () => void;
  onCreate: () => void;
}) {
  const zone = zones.find((z) => z.id === alert.zoneId);
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="alert-title">
        <button className="modal-close" onClick={onClose} aria-label="Close alert dialog">
          ×
        </button>
        <AlertTriangle className={`modal-symbol severity-${alert.severity}`} />
        <h2 id="alert-title">{alert.title}</h2>
        <p>{alert.reason}</p>
        {zone && (
          <dl className="facts">
            <div>
              <dt>Current</dt>
              <dd>{zone.temperature}°F</dd>
            </div>
            <div>
              <dt>Setpoint</dt>
              <dd>{zone.setpoint}°F</dd>
            </div>
            <div>
              <dt>Humidity</dt>
              <dd>{zone.humidity}%</dd>
            </div>
          </dl>
        )}
        <div className="explanation">
          <b>Why this matters</b>
          <p>
            A sustained difference can indicate a stuck damper, sensor drift, or equipment that is not meeting
            demand. Verify the space before changing controls.
          </p>
        </div>
        <div className="modal-actions">
          <button className="secondary" onClick={onClose} autoFocus>
            Close
          </button>
          <button className="primary" onClick={onCreate} disabled={orderExists}>
            {orderExists ? "Work order exists" : "Create work order"}
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderDialog({ onClose, onSubmit }: { onClose: () => void; onSubmit: (o: WorkOrder) => void }) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    onSubmit({
      id: String(Date.now()).slice(-4),
      title: String(data.get("title")),
      location: String(data.get("location")),
      priority: data.get("priority") as WorkOrder["priority"],
      status: "open",
      assignee: "Unassigned",
      createdAt: "Just now",
    });
  };
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <form className="modal" role="dialog" aria-modal="true" aria-labelledby="order-title" onSubmit={submit}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close work order dialog">
          ×
        </button>
        <ClipboardPlus className="modal-symbol" />
        <h2 id="order-title">Create work order</h2>
        <p>Capture enough detail for the next person to act.</p>
        <label>
          Title
          <input name="title" required maxLength={80} placeholder="What needs attention?" autoFocus />
        </label>
        <label>
          Location
          <select name="location">
            {zones.map((z) => (
              <option key={z.id}>
                {z.floor} · {z.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Priority
          <select name="priority">
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="low">Low</option>
          </select>
        </label>
        <div className="modal-actions">
          <button type="button" className="secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="primary">Create work order</button>
        </div>
      </form>
    </div>
  );
}
