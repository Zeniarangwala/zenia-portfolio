# Zenia Rangwala — Design Portfolio Brief

## 1. Objective and audience
Build a personal portfolio that introduces me as a UX and graphic designer with a digital marketing background and an interest in AI-assisted creative work. My point of view is accessibility: I have experienced being overlooked by design, and that perspective shapes how I design for others.

The primary audience is recruiters, hiring managers, creative directors, and prospective collaborators considering me for UX, graphic design, brand strategy, or marketing opportunities. Within the first screen, they should understand who I am, what I care about, and where to see my work.

## 2. Hero: exact content and hierarchy
My name must be prominent and immediately visible:

**Zenia Rangwala**

Use this exact punchline directly beneath it:

**I've been the user nobody designed for. Now I design for them.**

Use this subtitle:

**UX + Graphic Designer · Digital Marketing Enthusiast · AI-Curious Creative**

The primary call to action is **Explore my work ↓**. It must lead directly to the selected projects. Keep the hero concise enough that visitors reach the work quickly. Do not bury my name under a decorative animation, generic introduction, or full-screen loading sequence.

Navigation: Work, About, Connect. On mobile, keep navigation compact and keyboard accessible.

## 3. Selected projects: order and positioning
Feature these five projects in this order. Do not add projects simply to fill space.

| Project | Headline | Context |
| --- | --- | --- |
| Greyhound | Rebranding the bus for the people who actually ride it | Brand identity and strategy; student concept |
| Clearspace | Designing a task app for brains that get overwhelmed | UX and UI design |
| Arrival to Approval | Making Canadian credit make sense for newcomers | IBM service design capstone, Waterloo; Jan–Apr 2025; group project |
| Noise | What digital overload looks like on paper | Typographic editorial; Dec 2025–Apr 2026 |
| KidCash | Making a first banking app make sense to kids | Mobile banking app design for children; savings, chequing, and goals |

Each project preview must link to its own case-study page. Use original project artwork when supplied. Illustrative covers must be identified as illustrative; never pass generated or reconstructed mockups off as my final work.

## 4. Case-study template
Every case study follows the same information structure, with visual layouts adapted to the project:

1. **Project headline and one-line problem.** State the design question immediately.
2. **Quick facts.** My role, team, tools, and timeline. For group work, distinguish my contribution from the team’s output. Leave unknown details visibly marked for completion.
3. **Signature inclusion box.** Title: “Who this design includes and how.” Identify a specific audience and the decisions that support them. Distinguish intention from tested evidence; do not use a generic accessibility claim.
4. **Two or three actual directions.** Show alternatives I explored, the trade-offs of each, what I chose, and why. Do not invent retrospective process to fill this section.
5. **Final design.** Large original images and short explanatory captions. Include motion only when I have genuine project footage, with accessible controls, captions for speech, and a static alternative when appropriate.
6. **Outcome and reflection.** Use real critique feedback, recognition, testing, or lessons. If outcome evidence is unavailable, say what I would test or improve next. Never fabricate metrics, research participants, recognition, or impact.

Writing must be first-person, casual, clear, and recognisably mine. Keep paragraphs to two or three sentences. Avoid “leverage,” “seamless,” “elevate,” “holistic,” and similarly generic language. Do not use walls of sticky notes, empathy maps, or persona slides as substitutes for a clear design argument.

## 5. Visual direction
Clean, eye-catching, personal, and intentional. Let the projects provide most of the colour.

- Warm off-white background, near-black text, and one accent colour for the site interface.
- Use one or two typefaces. Consider Archivo or Archivo Expanded for headings, with a readable body font. No marker or handwriting fonts.
- Use three typographic size tokens: display/headings, body, and labels. Responsive values may adapt to screen width; text preferences may enlarge all three. Establish hierarchy through weight, spacing, placement, and colour rather than introducing additional sizes.
- Use generous space without making the hero or page unnecessarily long.
- Vary project compositions: a full-width lead project, offset two-column layouts, editorial image grids, and strong typographic moments. Avoid five identical template cards.
- Use subtle entrance or hover motion only. Honour reduced-motion settings from both the operating system and the site panel.
- Visual references: to be supplied. Do not claim to match references that have not been provided.

## 6. Signature interaction: “View this site your way”
Provide a compact, polished panel available on every page, with four independent preferences:

- Larger text.
- An optional dyslexia-friendly reading font; name the actual font and avoid claiming it benefits every dyslexic reader.
- High contrast.
- Reduced motion.

Use native, labelled controls with visible states. Save preferences in the browser when storage is available. Include a reset option, full keyboard access, and a way to close the panel without a mouse. Ensure the panel remains usable on narrow screens and at increased text size.

The default site must already be accessible. The panel offers preferences; it must not be necessary to access the content. A visitor’s operating-system reduced-motion preference must remain respected even if the panel’s motion setting is off.

## 7. About, contact, and credit
The About section should connect my design education, UX background, digital marketing experience, and accessibility perspective. Keep it short and avoid repeating the hero.

The contact section should offer real email, LinkedIn, and résumé links once provided. Do not invent addresses or use a form that appears to send messages when no delivery mechanism exists.

Footer: “Built with accessibility in mind. Designed by me, built with Claude Code.” Use that exact tool credit only if Claude Code actually builds the final site. For this ChatGPT-built version, use the truthful alternative: “Built with accessibility in mind. Designed by Zenia. Built with AI.”

## 8. Accessibility and performance requirements
Target WCAG 2.2 AA. Do not claim conformance without a suitable audit.

- Verify text contrast: at least 4.5:1 for normal text and 3:1 for large text. Check controls and visible focus indicators.
- Use semantic landmarks, a logical heading structure, a skip link, native links/buttons, and full keyboard navigation.
- Provide meaningful alt text for informative images; use empty alt text for purely decorative images. Keep captions distinct from alt text.
- Caption spoken video content and provide equivalents for important visual information. No unexpected audio or flashing effects.
- Support mobile layouts, increased text size, zoom, and reflow without losing content or controls.
- Compress images, specify dimensions, lazy-load below-the-fold images, and avoid unnecessary JavaScript or heavy animation libraries.
- Verify links, case-study navigation, preference persistence/reset, and reduced-motion behaviour. Test keyboard and screen-reader behaviour before a public launch.

## 9. Technical requirements
Use Astro with plain CSS. Store each case study as a Markdown or MDX file with frontmatter, so I can edit the text independently of the layout.

Suggested project frontmatter: slug, order, name, title, discipline, problem, role, team, tools, timeline, inclusion, inclusionStatus, coverAlt, and assetRequest. Missing facts must remain clearly identified until supplied.

Keep project images in `/public/images/<project>/`. Use descriptive filenames and optimise final photographs or screenshots. Keep original artwork separate from illustrative covers.

Provide unique page titles and descriptions, canonical URLs, and Open Graph metadata with a 1200 × 630 image for LinkedIn previews. Use the final custom domain consistently in site configuration and metadata once supplied.

The source must support a static build suitable for Vercel or Netlify. Include build configuration and editing instructions. A custom domain requires my domain choice and authorised access to the hosting/DNS account. Do not claim external deployment or domain connection before it is completed.

## 10. Inputs needed to finish the portfolio
- Original final project images and any genuine motion files.
- Two or three real directions and their trade-offs for each project.
- Confirmed role, team, tools, and dates where missing.
- My individual contributions to Arrival to Approval.
- Actual critique, testing, recognition, or other outcome evidence.
- Email, LinkedIn, résumé, and preferred custom domain.
- Optional visual inspiration links or screenshots.

## 11. Acceptance criteria
The first screen shows my name, exact punchline, subtitle, and work CTA. All five projects appear in the specified order and open dedicated pages. Every project has the inclusion callout and honest evidence status. Reading preferences work across pages. The site builds successfully, works responsively, and includes metadata and editing instructions. Final visuals and contact information must be completed before presenting it as an application-ready portfolio.
