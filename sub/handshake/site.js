/* Handshake - what is allowed to talk to what, and how it proves it.
 *
 * The seam with Least Authority is deliberate and worth stating, because the
 * two look adjacent and are not. Least Authority asks who is allowed to act:
 * authority, capabilities, confinement, the boundary around a running agent.
 * This one asks a question one layer down and one layer out - which endpoint
 * may open a connection to which other endpoint, over what, and what proves
 * the far end is who it claims. Least Authority would call a token holding too
 * much scope the bug. Here the bug is that the caller could reach the port at
 * all, and the token never came into it.
 *
 * The practical test for which module an entry belongs to: if the fix is a
 * change to a permission check, it is Least Authority. If the fix is a change
 * to a rule, a certificate, a listener or a route, it is here.
 *
 * No gate and no expiry. Both were considered and both were wrong for this
 * material. A commit-before-you-read gate suits a corpus where the answer is a
 * judgement you can be wrong about in an interesting way; most of this is a
 * rule with a mechanism under it, and gating "what does TLS actually prove"
 * behind a guess produces friction rather than calibration. Expiry suits a
 * corpus that turns over, and the load-bearing half of this one is protocol
 * behaviour from the 1980s and 1990s that has outlived every product built on
 * top of it. What does turn over is vendor defaults, and those do not belong in
 * a corpus you revisit for a year.
 *
 * That leaves the cheatsheet as the only mechanic beyond recall, which is the
 * honest configuration rather than a thin one: this is a corpus of rules, and a
 * rule you cannot hold in your head while you are editing the policy has not
 * finished being learned. */
window.SITE = {
  key: 'handshake.v1',
  slug: 'handshake',
  name: 'Handshake',
  eyebrow: 'Trace',
  tagline: 'what is allowed to talk to what, and how it proves it',

  /* Ordered so the round-robin first cycle serves the model track first and the
     detection track last, which is also the order they should be read in: the
     model is the set of claims the rest depend on, and visibility is about
     detecting failures of the other eight. */
  tracks: [
    { id: 'model', name: 'The network security model' },
    { id: 'tls', name: 'TLS and what it proves' },
    { id: 'identity', name: 'Proving the far end' },
    { id: 'ingress', name: 'Ingress' },
    { id: 'egress', name: 'Egress' },
    { id: 'browser', name: 'The browser as a network client' },
    { id: 'naming', name: 'Naming' },
    { id: 'segmentation', name: 'Segmentation' },
    { id: 'visibility', name: 'Seeing the network' }
  ],

  /* Which of the three an entry is really about, because the same topic can be
     any of them and the failure modes differ. On the wire is protocol
     behaviour you cannot argue with. Policy is how you express the rule.
     Operations is what happens to the rule over the following two years, which
     is where most of them die. */
  levels: { wire: 'On the wire', policy: 'Policy', ops: 'Operations' },

  review: 'leitner',
  intervals: [1, 3, 7, 16, 35],

  /* Opt-in rather than verdict-filtered. There is no replication verdict
     anywhere in this corpus and there should not be: an RFC describing what a
     stateful filter does with a return packet is not a finding that could fail
     to replicate, it is a specification. So the row is a selection, and the
     page says the count it leaves off rather than implying the rows are the
     whole corpus. An entry earns one when it is a rule you can apply with your
     hands on the policy file. It is denied one when it is a mechanism or a
     history, because those are why the rules exist and they need the full
     entry to land. */
  cheatsheet: true,

  copy: {
    tabCheatsheet: 'Rule sheet',
    cheatNote: 'The rules worth having in your head while the policy file is open, rather than after somebody reviews the pull request.',
    cheatWithheld: 'are mechanisms and histories rather than rules - they are why the rules exist, and a one-line version of them would be worse than nothing.',
    labelIdea: 'The rule',
    labelWhy: 'What is actually going on',
    labelFailure: 'What an attacker does with it',
    labelExperiment: 'Trace it today',
    labelReflect: 'Log it',
    sourcePrefix: 'After',
    reflectPlaceholder: 'What the trace actually showed, and which rule you now know is not enforced.',
    recallFirst: 'Recall first, then read. A rule you can only recognise is one you will approve in review and never think to write.',
    reviewNote: 'Answer before you turn the card, and answer in the form of a rule rather than a topic. Knowing that TLS is involved is not the skill.',
    progressNote: 'Entries read is not the number. The number is how many of these rules you have actually traced against something you run, because a network policy nobody has tried to violate is a document rather than a control.'
  },

  /* Packet capture. Cool grey paper with a saturated navy for structure,
     because that is the colour every tool that has ever shown you a connection
     list uses, and magenta for the things that want a hand on a terminal.
     Magenta rather than the house amber on purpose: amber and red are what the
     alerting already spends, and nothing here is an alert. */
  palette: {
    faceDisplay: '"Avenir Next", "Segoe UI", system-ui, Corbel, sans-serif',
    light: {
      paper: '#F2F4F7', paperRaised: '#FFFFFF', paperSunk: '#E5E9EF',
      gridTint: '#101A2A', rule: '#D5DBE4', ruleStrong: '#ACB6C4',
      ink: '#111721', inkMuted: '#4C5765', inkFaint: '#828D9C',
      accent: '#2B4C8C', accentInk: '#213C72', action: '#AD3A6C',
      solid: '#2F6B4F', shaky: '#8A6A1F'
    },
    dark: {
      paper: '#0B0E14', paperRaised: '#11151D', paperSunk: '#070A0F',
      gridTint: '#9FB6D8', rule: '#1C2230', ruleStrong: '#2F3849',
      ink: '#D8DEE8', inkMuted: '#919BAA', inkFaint: '#636D7C',
      accent: '#7BA3DC', accentInk: '#A3C1E9', action: '#E888B4',
      solid: '#63B08A', shaky: '#C9A651'
    }
  },

  prompt: {
    intro: 'I am working through a network security rule and want to find out whether it is actually enforced in the estate my team runs.',
    closing: 'Assume a multi-tenant platform on Kubernetes with a service mesh, an ingress in front of it and workloads that reach customer-owned warehouses over the internet. Tell me the single command or query that would show whether this rule holds, and do not accept the architecture diagram as evidence.'
  }
};
