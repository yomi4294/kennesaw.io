import { useState } from 'react';

const TOTAL = 10;

const CHECKLIST_ITEMS = [
  { id: 1, category: 'Access Control', text: 'Application uses read-only cloud credentials scoped to specific resources only.' },
  { id: 2, category: 'Access Control', text: 'No long-lived static API keys used; credentials rotate or are short-lived (e.g., IAM role assumption).' },
  { id: 3, category: 'Data Security', text: 'All endpoints enforce HTTPS / TLS 1.2+. HTTP requests are redirected or rejected.' },
  { id: 4, category: 'Data Security', text: 'Secrets and credentials are stored in a vault or encrypted at rest. None are hard-coded in source.' },
  { id: 5, category: 'Data Governance', text: 'All data assets are classified (Public / Internal / Confidential / Regulated).' },
  { id: 6, category: 'Data Governance', text: 'Only data necessary for the application\'s function is collected (data minimization).' },
  { id: 7, category: 'Compliance', text: 'Applicable regulations identified (HIPAA / PCI DSS / GDPR) and controls documented.' },
  { id: 8, category: 'Compliance', text: 'Security headers applied on all responses (HSTS, X-Frame-Options, CSP, etc.).' },
  { id: 9, category: 'Logging & Monitoring', text: 'Every API request is logged with timestamp, IP, method, path, and status code.' },
  { id: 10, category: 'Logging & Monitoring', text: 'Rate limiting is enabled; alerts are configured for unusual traffic patterns.' },
];

const POLICIES = [
  {
    icon: '🔒',
    title: '1. Access Control',
    body: (
      <>
        <p>
          The system must use <strong>role-based access control (RBAC)</strong> and the{' '}
          <strong>principle of least privilege</strong> to ensure the application only has
          read-only permissions to the specific data it needs.
        </p>
        <ul>
          <li>Assign roles at the smallest scope possible (e.g., single subscription or billing account).</li>
          <li>Use pre-built read-only roles: <em>ReadOnlyAccess</em> (AWS), <em>billing.viewer</em> (GCP), <em>Cost Management Reader</em> (Azure).</li>
          <li>Authenticate via short-lived, federated credentials rather than long-lived static keys.</li>
          <li>Review and audit role assignments quarterly. Revoke unused permissions immediately.</li>
          <li>Apply multi-factor authentication (MFA) to any account that can modify cloud permissions.</li>
        </ul>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {['RBAC', 'Least Privilege', 'Read-Only'].map(b => <Badge key={b}>{b}</Badge>)}
          <Badge color="green">SOC 2 CC6.1</Badge>
          <Badge color="orange">NIST AC-6</Badge>
        </div>
      </>
    ),
  },
  {
    icon: '🔑',
    title: '2. Data Security',
    body: (
      <>
        <p>
          All data transferred between the web application and the cloud environment must be
          encrypted using secure protocols such as <strong>HTTPS</strong> and <strong>TLS 1.2+</strong>.
          Sensitive information must be stored securely using tools like key vaults or secret managers —
          never hard-coded.
        </p>
        <ul>
          <li>Enforce HTTPS on all endpoints. Redirect HTTP to HTTPS automatically.</li>
          <li>Use TLS 1.2 or higher; disable older versions (TLS 1.0, SSL 3.0).</li>
          <li>Store secrets in a dedicated vault: AWS Secrets Manager, GCP Secret Manager, or Azure Key Vault.</li>
          <li>Encrypt credentials at rest using AES-256.</li>
          <li>Never log full API keys, tokens, or passwords.</li>
          <li>Apply HSTS headers (<code>Strict-Transport-Security</code>) to prevent downgrade attacks.</li>
        </ul>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {['TLS 1.2+', 'AES-256', 'HTTPS Enforced'].map(b => <Badge key={b}>{b}</Badge>)}
          <Badge color="green">PCI DSS 4.2</Badge>
          <Badge color="orange">NIST SC-8</Badge>
        </div>
      </>
    ),
  },
  {
    icon: '📄',
    title: '3. Data Governance',
    body: (
      <>
        <p>
          Data governance policies ensure that data is properly classified and the application only
          accesses approved data sources. Every piece of data should carry a classification label.
        </p>
        <ul>
          <li><strong>Public</strong> — freely shareable; no restrictions.</li>
          <li><strong>Internal</strong> — for authorized users only (e.g., pipeline configurations).</li>
          <li><strong>Confidential</strong> — business-sensitive; encrypted at rest and in transit.</li>
          <li><strong>Regulated</strong> — subject to HIPAA, GDPR, or PCI DSS; must follow additional handling rules.</li>
        </ul>
        <p>
          Data lineage must be documented: where data originates, who can access it, and how long it is retained.
          Apply data minimization — collect only the fields required for the task.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {['Data Classification', 'Data Minimization', 'Confidential'].map(b => <Badge key={b}>{b}</Badge>)}
          <Badge color="red">Regulated</Badge>
          <Badge color="green">GDPR Art. 5</Badge>
        </div>
      </>
    ),
  },
  {
    icon: '⚖️',
    title: '4. Compliance',
    body: (
      <>
        <p>
          Compliance policies must be followed depending on the type of data being accessed.
          Even if the application only <em>reads</em> data, it must adhere to these regulations.
        </p>
        <ul>
          <li><strong>HIPAA</strong> — governs healthcare data. Requires access controls, audit logs, and encrypted transmission of PHI.</li>
          <li><strong>PCI DSS</strong> — governs financial and cardholder data. Mandates network segmentation, access logging, and regular vulnerability assessments.</li>
          <li><strong>GDPR</strong> — governs personal data of EU residents. Requires lawful basis for processing and records of processing activities (Art. 30).</li>
          <li><strong>SOC 2</strong> — audits service providers on security, availability, and confidentiality. Trust Services Criteria CC6 covers logical access.</li>
        </ul>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          <Badge color="red">HIPAA</Badge>
          <Badge color="red">PCI DSS</Badge>
          <Badge color="red">GDPR</Badge>
          <Badge color="orange">SOC 2</Badge>
          <Badge>ISO 27001</Badge>
        </div>
      </>
    ),
  },
  {
    icon: '📊',
    title: '5. Logging & Monitoring',
    body: (
      <>
        <p>
          Logging and monitoring policies ensure that all access to cloud data is tracked and auditable.
          This includes recording when data is accessed, by whom, and from where.
        </p>
        <ul>
          <li>Log every API request: timestamp, HTTP method, path, status code, source IP, and user-agent.</li>
          <li>Tag each log entry with the data classification of the accessed resource.</li>
          <li>Never log full secrets — use truncated hints only (first 8 characters max).</li>
          <li>Emit structured (JSON) log lines for ingestion by SIEM tools (Splunk, Azure Sentinel, CloudWatch).</li>
          <li>Enforce rate limits per IP; {'>'} 120 req/min triggers a 429 and a warning alert.</li>
          <li>Set up alerts for: access outside business hours, access from new countries, bulk data exports, repeated auth failures.</li>
          <li>Retain logs for a minimum of 90 days (PCI DSS), 1 year (HIPAA), or as required by jurisdiction.</li>
        </ul>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {['Audit Trail', 'SIEM', 'Rate Limiting'].map(b => <Badge key={b}>{b}</Badge>)}
          <Badge color="green">PCI DSS 10.x</Badge>
          <Badge color="orange">HIPAA 164.312(b)</Badge>
          <Badge color="red">GDPR Art. 30</Badge>
        </div>
      </>
    ),
  },
];

function Badge({ children, color }) {
  const styles = {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
    ...(color === 'red'    ? { background: '#fde8e8', color: '#900',    border: '1px solid #f5b8b8' } :
        color === 'green'  ? { background: '#e6f4ea', color: '#1a6b2e', border: '1px solid #a8d5b2' } :
        color === 'orange' ? { background: '#fef3e2', color: '#7a4900', border: '1px solid #f5d19a' } :
                             { background: '#e0ecf8', color: '#003366', border: '1px solid #a8c4de' }),
  };
  return <span style={styles}>{children}</span>;
}

function PolicySection({ icon, title, body }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="policy-section">
      <button className="policy-header" onClick={() => setOpen(!open)}>
        <span className="icon">{icon}</span>
        <h3>{title}</h3>
        <span className={`toggle ${open ? 'open' : ''}`}>+</span>
      </button>
      {open && <div className="policy-body">{body}</div>}
    </div>
  );
}

export default function CloudSecurityPolicy() {
  const [checked, setChecked] = useState({});

  function toggle(id) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const score = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((score / TOTAL) * 100);
  const barColor =
    pct >= 80 ? 'linear-gradient(90deg,#1a6b2e,#28a745)' :
    pct >= 50 ? 'linear-gradient(90deg,#7a4900,#fd9800)' :
                'linear-gradient(90deg,#900,#dc3545)';

  return (
    <div>
      <h2 style={{ color: '#003366', marginTop: 0 }}>IT Security Policies for Cloud-Connected Web Applications</h2>
      <p style={{ marginBottom: 20 }}>
        Web-based software that reads data from cloud environments such as{' '}
        <strong>Microsoft Azure</strong>, <strong>Google Cloud</strong>, or{' '}
        <strong>Amazon Web Services</strong> must follow strict IT policies to ensure the
        data is accessed securely, accurately, and in compliance with industry standards.
        Click any section to expand it.
      </p>

      {POLICIES.map(({ icon, title, body }) => (
        <PolicySection key={title} icon={icon} title={title} body={body} />
      ))}

      <div style={{
        background: '#f7fbff',
        border: '1px solid #b8d4ea',
        borderRadius: 6,
        padding: 20,
        marginTop: 28,
      }}>
        <h2 style={{ color: '#003366', marginTop: 0 }}>✓ Self-Assessment Checklist</h2>
        <p style={{ color: '#555', fontSize: 14, marginBottom: 16 }}>
          Check each item your application already satisfies to measure your compliance posture.
        </p>

        {CHECKLIST_ITEMS.map((item) => (
          <label
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              marginBottom: 10,
              padding: '8px 10px',
              borderRadius: 4,
              background: checked[item.id] ? '#e8f5e9' : '#fff',
              border: `1px solid ${checked[item.id] ? '#a8d5b2' : '#dce8f2'}`,
              cursor: 'pointer',
              transition: 'background 0.2s, border-color 0.2s',
            }}
          >
            <input
              type="checkbox"
              checked={!!checked[item.id]}
              onChange={() => toggle(item.id)}
              style={{ marginTop: 3, transform: 'scale(1.2)', cursor: 'pointer' }}
            />
            <span><strong>{item.category}:</strong> {item.text}</span>
          </label>
        ))}

        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 14, color: '#555', marginBottom: 4 }}>
            Compliance score: <strong>{score} / {TOTAL} ({pct}%)</strong>
          </div>
          <div style={{ height: 20, background: '#dce8f2', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${pct}%`,
              background: barColor,
              borderRadius: 10,
              transition: 'width 0.4s ease, background 0.4s ease',
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
