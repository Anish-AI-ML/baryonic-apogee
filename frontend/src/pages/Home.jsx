import { ArrowDownRight, ArrowUpRight, Check, Layers3, Sparkles, ShoppingBag, PanelsTopLeft, CalendarDays } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import './Home.css';

const projects = [
  { name: 'Vive Fabrics', type: 'E-commerce', url: 'https://vivefabrics.shop', crop: 'fabric', size: 'small' },
  { name: 'AskIt', type: 'Startup product', url: 'https://askit.in', crop: 'product', size: 'small' },
  { name: 'ICOFT', type: 'Academic conference', url: 'https://icoft.vercel.app', crop: 'campus', size: 'large' },
  { name: 'IConSCEPT', type: 'Conference platform', url: 'https://iconscept.in', image: '/images/iconscept-project.png', crop: 'full', size: 'small' },
  { name: 'IC3DCM', type: 'Conference platform', url: 'https://ic3dcm.in', crop: 'stage', size: 'large' },
  { name: 'SSMDS', type: 'Healthcare website', url: 'https://ssmds.in', image: '/images/ssmds-project.png', crop: 'full', size: 'small' },
];

const services = [
  { icon: PanelsTopLeft, number: '01', title: 'Websites that earn trust', text: 'A confident first impression, a clear story, and a path that turns the right visitors into customers.' },
  { icon: Layers3, number: '02', title: 'Product & MVP interfaces', text: 'Thoughtful, production-ready interfaces that help new products feel real from the first click.' },
  { icon: ShoppingBag, number: '03', title: 'Online stores', text: 'A considered shopping experience that puts your products first on every screen.' },
];

const steps = [
  ['01', 'Listen', 'We start with your goals, your customers, and what success needs to look like.'],
  ['02', 'Shape', 'We turn the brief into a clear structure and visual direction before the build begins.'],
  ['03', 'Build', 'I design and develop the experience with responsive details and real content in mind.'],
  ['04', 'Launch', 'We refine the details together, then get your new site ready for the world.'],
];

function Home() {
  const [form, setForm] = useState({ name: '', email: '', project: '' });
  const [showAllProjects, setShowAllProjects] = useState(false);
  const projectGrid = useRef(null);

  useEffect(() => {
    const grid = projectGrid.current;
    if (!grid) return;
    const cards = [...grid.querySelectorAll('.nova-project')];
    if (!('IntersectionObserver' in window)) {
      cards.forEach((card) => card.classList.add('is-visible'));
      return;
    }
    grid.classList.add('reveal-ready');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -35px 0px' });
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [showAllProjects]);
  const visibleProjects = showAllProjects ? projects : projects.slice(0, 4);
  const submit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Project enquiry from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nProject details:\n${form.project}`);
    window.location.href = `mailto:anvetechnologies@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <main className="home-page-wrapper nova-home" id="home">
      <section className="nova-hero">
        <div className="nova-shell nova-hero-grid">
          <div className="nova-hero-copy">
            <div className="nova-eyebrow"><span className="nova-status-dot" /> Independent digital studio <span className="nova-eyebrow-rule" /> India · Working everywhere</div>
            <h1>Good ideas deserve <em>a better</em> digital home.</h1>
            <p className="nova-hero-lede">We design and build thoughtful websites and digital products for people building something that matters.</p>
            <div className="nova-hero-actions">
              <HashLink smooth to="/#contact" className="nova-button nova-button-dark">Let’s talk <ArrowUpRight size={17} /></HashLink>
              <HashLink smooth to="/#work" className="nova-text-link">Explore our work <ArrowDownRight size={17} /></HashLink>
            </div>
            <div className="nova-hero-note"><span className="nova-note-lines">✳</span><span>Small team. Close collaboration.<br /><strong>Made with care, from first sketch to launch.</strong></span></div>
          </div>
          <div className="nova-hero-art" aria-label="Abstract illustration of the Anve digital studio">
            <div className="nova-art-grid" />
            <div className="nova-art-orbit nova-orbit-one" /><div className="nova-art-orbit nova-orbit-two" />
            <div className="nova-art-sun" />
            <div className="nova-art-card nova-art-card-top"><span>ANVE / STUDIO</span><Sparkles size={15} /><b>Digital, with intention.</b><small>DESIGN × DEVELOPMENT</small></div>
            <div className="nova-art-card nova-art-card-bottom"><div className="nova-art-swatch" /><span>Built for people.<br /><strong>Ready for what’s next.</strong></span><ArrowUpRight size={18} /></div>
            <div className="nova-art-caption">A little more human. A lot more considered.</div>
          </div>
        </div>
        <div className="nova-shell nova-hero-bottom"><span>01 — 04</span><span>Scroll to explore</span><span className="nova-bottom-line" /></div>
      </section>

      <section className="nova-proof" aria-label="Selected clients and projects">
        <div className="nova-shell nova-proof-row"><span className="nova-proof-label">A few good collaborations</span><div className="nova-proof-logos"><b>IC3DCM</b><b>askit<span>.</span></b><b>vive <i>fabrics</i></b><b>ICOFT</b><b>ssmds</b></div></div>
      </section>

      <section className="nova-section nova-work" id="work">
        <div className="nova-shell">
          <div className="nova-section-heading"><div><span className="nova-kicker">A selection of our work <span>↘</span></span><h2>Made to move<br />things forward.</h2></div><p>Different people, different challenges. Each project starts with listening and ends with something built to last.</p></div>
          <div className="nova-project-grid" ref={projectGrid}>{visibleProjects.map((project) => <a className={`nova-project nova-project-${project.size}`} href={project.url} target="_blank" rel="noreferrer" key={project.name}><div className={`nova-project-image nova-photo-${project.crop}`}><img src={project.image || '/images/work-contact-sheet.png'} alt={`${project.name} ${project.type} project`} loading="lazy" /><span className="nova-project-type">{project.type}</span><span className="nova-project-arrow"><ArrowUpRight size={19} /></span></div><div className="nova-project-meta"><div><h3>{project.name}</h3><span>{project.type}</span></div></div></a>)}</div>
          <button className="nova-see-more" type="button" aria-expanded={showAllProjects} onClick={() => setShowAllProjects((show) => !show)}>{showAllProjects ? 'Show fewer projects' : 'See more work'} <ArrowDownRight size={16} /></button>
        </div>
      </section>

      <section className="nova-section nova-services" id="services"><div className="nova-shell"><div className="nova-section-heading"><div><span className="nova-kicker">What we do</span><h2>From first thought<br />to finished thing.</h2></div><p>One small, focused team for strategy, design, and development. No handoffs. No mystery.</p></div><div className="nova-service-list">{services.map(({ icon: Icon, number, title, text }) => <article className="nova-service" key={number}><span className="nova-service-number">{number}</span><span className="nova-service-icon"><Icon size={21} strokeWidth={1.5} /></span><div><h3>{title}</h3><p>{text}</p></div><ArrowUpRight className="nova-service-arrow" size={20} /></article>)}</div></div></section>

      <section className="nova-belief" id="standards"><div className="nova-shell nova-belief-grid"><span className="nova-kicker">A note on how we work</span><div><h2>Good design isn’t decoration. It’s how people <em>feel the difference.</em></h2><p>We bring clarity to the complex, care to the small details, and a point of view to every screen. The result feels like you—and works beautifully for the people you serve.</p><div className="nova-belief-points"><span><Check size={16} /> Clear by design</span><span><Check size={16} /> Thoughtful on every screen</span><span><Check size={16} /> Built for the long run</span></div></div><div className="nova-belief-mark">a<span>.</span></div></div></section>

      <section className="nova-section nova-process" id="process"><div className="nova-shell"><div className="nova-section-heading"><div><span className="nova-kicker">Simple, thoughtful, collaborative</span><h2>Good work happens<br />in good company.</h2></div><p>You’ll know what’s happening, what comes next, and who to talk to. That’s the whole process.</p></div><div className="nova-steps">{steps.map(([num, title, text]) => <article className="nova-step" key={num}><span>{num}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

      <section className="nova-contact" id="contact"><div className="nova-shell nova-contact-grid"><div className="nova-contact-copy"><span className="nova-kicker">Have something in mind?</span><h2>Let’s make<br /><em>it matter.</em></h2><p>Tell us a little about what you’re working on. We’ll take it from there, together.</p><a href="mailto:anvetechnologies@gmail.com" className="nova-contact-email">anvetechnologies@gmail.com <ArrowUpRight size={16} /></a><div className="nova-contact-location"><CalendarDays size={16} /> Usually reply within one business day</div></div><form className="nova-contact-form" onSubmit={submit}><label>Your name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="What should we call you?" /></label><label>Email address<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" /></label><label>A little about your project<textarea required rows="4" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} placeholder="What are you hoping to make?" /></label><button className="nova-button nova-button-lime" type="submit">Send an enquiry <ArrowUpRight size={17} /></button><span className="nova-form-note">Opens a new email to our studio. No mailing lists, ever.</span></form></div><div className="nova-contact-stamp"><span>ANVE</span><small>LET’S MAKE<br />GOOD THINGS</small></div></section>
    </main>
  );
}

export default Home;
