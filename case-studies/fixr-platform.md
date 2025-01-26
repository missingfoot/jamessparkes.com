**Project name**: FIXR
**Tagline/description**: A ticketing and event management platform empowering event organisers to sell tickets, manage attendees, and streamline event operations.
**Platforms**: Web apps, mobile apps, design system
**Role**: UX/UI designer  \

---

## Overview
FIXR is a mobile-first ticketing and event management platform empowering event organisers worldwide to sell tickets, manage attendees, and streamline event operations. As a UX designer at FIXR, I worked on various projects ranging from small feature enhancements to larger, headline functionality. Our customer base includes both small, self-serve organisers and larger-scale clients, whose feedback often guided iterative improvements to the product.

One of my most significant projects involved designing a new **customer messaging platform** to help organisers send notifications, marketing messages, and critical service updates.

### Tasks & responsibilities
Throughout my time at FIXR I...
- Collaborated with cross-functional teams (product, development, sales, and customer relations) to identify user needs and translate them into design requirements.
- Conducted user research, competitive analysis, and iterative testing sessions to inform design decisions.
- Led the end-to-end design process for the **customer messaging platform**, from **initial research** to **developer handoff**.
- Balanced user needs, business requirements, and technical constraints to deliver an impactful solution.

---

## Project: Data-driven ticketing insights

### Problem
Event organizers needed to view and compare multiple datasets (e.g., revenue, ticket sales, demographics) in a way that was intuitive and not overwhelming. The system we designed would need to be able to handle large amounts of data and be reusable for future metrics and chart types.

### Contributions
- Led the design of **Insights**, a feature aimed at securing new clients by offering superior data insights and benchmarks compared to competitors.  
- Worked with a data analyst to identify key metrics based on client and stakeholder feedback
- Designed a system to compare any event with multiple others, as long as they had sufficient sales data.  
- Researched and designed **scalable, reusable charts** to handle multiple datasets and future metrics.  
- Ensured **mobile-first design**, making all charts and controls fully functional and intuitive on mobile devices.  
- Added **clear signposting and explanations** to help users interpret complex data accurately, especially for metrics where trends (e.g., "up" or "down") could have varying implications. 

![Competitor research for the Insights feature](f-insights-competitor-research.png)

### Challenges and solutions
- **Scalable and reusable charts**: Designing charts that could handle multiple datasets and adapt to future needs.
- **Solution**: Created a flexible, reusable charting system inspired by research into best practices across various platforms.  

- **Mobile-first design**: Many competitors' dashboards were either non-functional or buggy on mobile.
- **Solution**: Prioritised mobile-first design, ensuring seamless functionality and usability on smaller screens.

![The Insights charts in mobile with their mobile specific controls](f-insights-mobile-analytics.png)

- **Clear data interpretation**: Some metrics (e.g., ticket sales trends) could be ambiguous—what looked positive might not always be good.
- **Solution**: Added contextual explanations and clear signposting to ensure users could interpret data accurately.  

### Reflections & key takeaways
- Delivered a powerful tool for event organisers, helping them make data-driven decisions.  
- Received overwhelmingly positive feedback from users.  
- Laid the groundwork for Insights to become a **paid subscription** in the future.  
- One of the most challenging and rewarding projects of my career.  
- Loved solving complex problems like mobile responsiveness and clear data interpretation.  
- Proud to have created a feature that set FIXR apart from competitors and helped event organisers grow their businesses.

---

## Project: Customer messaging platform

### Project context
To remain competitive and to outperform existing event management competitors, I was tasked with creating a robust messaging platform for FIXR's event organisers. The new platform needed to address three major workflows:

- Sending event notifications
- Dispatching marketing messages
- Delivering critical service updates

### Problem
Prior to this project, organisers could only send basic, single-event notifications—one at a time, with no scheduling options and minimal customisation. This limited their ability to communicate effectively with attendees, especially when promoting multiple events or sending segmented marketing campaigns.

### Goals
- **Scheduling**: Enable organisers to schedule messages in advance for better workflow management.  
- **Multi-event promotion**: Allow organisers to promote multiple events simultaneously.  
- **Customisation & branding**: Let organisers use their own copy, tone of voice, and visual branding in messages.  
- **Service emails & critical updates**: Provide a clear path for sending important service messages (e.g., event changes, cancellations).

### Constraints & considerations
- **Risk of misuse**: Granting organisers the power to send potentially thousands of emails or messages at once posed a **reputational** and **compliance** risk. We needed to implement checks and safeguards to prevent nefarious or spam-like behaviour.
- **Technical feasibility**: Creating a scalable messaging system required buy-in from engineering to ensure performance and reliability especially with new added complex systems like timed entry.
- **Timeline & scope**: We had to deliver a **manageable first release** that could be iterated on, based on customer feedback.

### Research
- **Competitor analysis**: I examined popular CRM tools and direct competitors in the event ticketing space. This helped me understand how others approached messaging workflows, audience segmentation, and brand customisation, as well as how they mitigated misuse (e.g., permissions, throttling, and content guidelines).

### Stakeholder questioning
- **Accounts team & customer relations**: Provided insights into common client requests and pain points.  
- **Terminology familiarity**: Using language and structures familiar to CRM users would reduce the learning curve.  
- **Audience segmentation**: Offering a way to segment attendee groups (e.g., VIPs, repeat customers) was highly desired.  
- **Robust safeguards**: Mechanisms to prevent spam and abuse (e.g., admin approvals, daily send limits for new accounts).


### Ideation & collaboration
Workshops with stakeholders from various departments revealed what features to potentially include in the MVP:
- **Accounts team**: Prioritised must-have features based on demand such as multi-event promotions, scheduling.
- **Customer relations**: Provided insights into common client requests and pain points and prioritised service updates.
- **Engineering**: Balanced feasibility and timeline constraints by prioritising features that were most likely to be successful in short term and made designs with additional feature sets for future iterations.
- **Product**: Prioritised technical requirements like working with other systems such as timed entry.

From these workshops product management created a feature roadmap with clear priorities for the final product where I prioritised and created a prototype from which to get further feedback from the team and stakeholders for an MVP that could be delivered on time by engineering.

### Prototyping & iteration
**Low-fidelity wireframes**: I started by mapping out user flows for scheduling messages, creating segmented lists, and customising templates.  
**Interactive prototypes**: Using Figma, I built mid- to high-fidelity prototypes to simulate key interactions (e.g., segment selection, scheduling calendar).  
**Feedback rounds**: After each iteration, I gathered input from internal stakeholders:  
- Ensured the interface was straightforward, with step-by-step flows for new users.  
- Added pre-built templates for recurring communications.
- Implemented sign-posting before sending campaigns, including confirmations and potential send limits for new accounts.
- Cut certain advanced features (like complex audience segmentation rules) to keep the first release focused and deliverable.

![Early iterative prototype of the message centre](mc-artboard.png)

### Outcome & impact

- **Improved workflow efficiency**: Organisers could schedule and send multiple notifications in one go, saving significant time.  
- **Brand consistency**: Users now had the freedom to include custom branding and maintain their own tone of voice.  
- **Risk management**: Built-in checks reduced the chance of spam or misuse, preserving FIXR's reputation.  
- **Positive feedback**: Beta testers praised the intuitive interface and welcomed the ability to reach their attendees in a more personalised, scalable way.

![The new messaging scheduler in action](mc-new-scheduler.mp4)

Although there was no official KPI measurement at the time of initial launch, anecdotal feedback from organisers indicated they experienced **higher open rates** and **better engagement** when promoting events through the new messaging system.

### Reflections & key takeaways
- **Further segmentation**: Future iterations could include more sophisticated audience targeting (e.g., dynamic filters event attendance and audience segmentation)
- **Analytics dashboard**: Designs for real-time stats on open rates, click-through rates, and unsubscribes would offer deeper insights for organisers that was indentified as a must-have feature by the accounts team.
- **Continuous user feedback**: Ongoing beta tester reviews and usage analytics would help refine the platform and prioritise additional features that I wouuld add.
- **Holistic UX approach**: Balancing user needs (scheduling, personalisation) with company concerns (risk mitigation, technical constraints) is vital in complex projects.  
- **Cross-functional collaboration**: Involving stakeholders from sales, product, and customer support ensured alignment on features that matter most.  
- **Iterative development**: Phasing out non-critical features helped us ship a functional MVP quickly, with room to grow in future releases.

---

## Revenue growth contributions
As a key contributor at FIXR, where client acquisition and retention directly drove revenue, I spearheaded strategic initiatives to elevate the company's competitive edge, secure high-value clients, and streamline operational efficiency. My work focused on three core areas:  

### Client acquisition
FIXR would offer a custom app and website option for clients to integrate into the FIXR platform without existing infrastructure.
- **My contribution:** Advocated for a robust **self-serve CMS system** and designed **robust app/website templates** that became critical selling points in sales pitches. I ensured these templates integrated seamlessly with clients' branding and addressed common client needs. Sales teams attributed these features helping to win contracts with clients generating **£20k** for smaller clients **£50k** for medium clients and **£100k** for large clients **annually**, including large-scale organisers like [Middle East Film and Comic Con](https://www.mefcc.com/home/), and [The Bath & West Showground](https://www.bathandwest.com/).

![Website template example for Ministry of Sound](f-client-website-integration.png)

![App template example for Ministry of Sound](f-client-app-integration.png)

- **Strategic feature development:** Identified gaps in the market and proposed cost-effective solutions, such as the **self-serve interactive map feature** for venue navigation. By leveraging existing client assets (e.g., venue images) and simplifying integration, this feature became a key differentiator for event organisers with complex venues, directly contributing to closing high-value contracts.

![Venue navigation map maker and app integration](f-map-maker.png)

- **Pitch deck innovation:** Created client-specific mockups of apps, websites, branded checkout flows and prototypes to demonstrate value during sales pitches. For urgent opportunities, I streamlined asset production from **down from 1 day to 1–2 hours**, ensuring rapid response to high-priority RFPs and reducing internal costs.

![Pitch deck assets](f-pitch-deck-assets.png)

![Pitch deck assets](f-pitch-deck-assets-data.png)

- **Result:** Reduced reliance on custom development for smaller clients meaning faster turnaround on these. Retained carefully considered custom solutions for larger clients through research into their specific systems and workflows and sales structures which contributed to being chosen over competitors for larger clients.

---

### Client retention
- **Client retention:** Designed and maintained streamlined easy to implement checkout flow with upsell capabilities through insurance and pay in 3 capabiltiees, tax and fee calculations considerations which contributed higher ticket sales for both the clients and FIXR. By making the platform indispensable to operations, clients were likely to stay with us longer for muultiple contract rounds securing longer-term revenue streams.

![Checkout flow](f-timed-entry-checkout-builder.png)

- **Checkout flow redesign:** Designed a frictionless and easy to use self-serve checkout flow builder to balance user experience and profit optimisation. Larger clients were able to upsell add-ons and various ticket types and options which contributed to higher ticket sales by creating their own optimised checkout flows suited to their business.

![Checkout flow builder](f-custom-checkout-builder.png)

---

### Cost efficiency
- **Operational streamlining:** Reduced internal costs by **migrating small/medium clients to a scalable WordPress template** (based on my original designs) and outsourcing development. This freed internal teams to focus on high-value custom projects.  
- **Asset library creation:** Built a reusable bank of templated visuals (e.g., event-type images, currency-specific widgets) that cut pitch deck preparation time by 80%, empowering sales to act swiftly on opportunities.  

---

### Summary
My contributions directly supported the acquisition and retention of clients across all tiers, which were central to the company's revenue model—a percentage of tickets sold. By enhancing the platform's appeal, reducing design costs, and demonstrating long-term value for client operations and user benefits, I played a key role in driving sustainable growth for the business.

These efforts helped secure recurring annual revenue streams for FIXR. My key strengths included strategically aligning product design with revenue goals, bridging client needs with technical execution, and maintaining a proven track record of reducing costs while scaling operations effectively. 


**Website**: [FIXR](https://fixr.co/)