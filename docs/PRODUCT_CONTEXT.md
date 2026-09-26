# Your Virtual Caddy — Product Context

This document is the project source of truth for product direction, MVP scope, and architecture philosophy. Prefer this over inventing features or infrastructure.

---

## 1. Product Overview

**Product name:** Your Virtual Caddy

**Core idea:**
Your Virtual Caddy is a digital golf caddy designed to help golfers make better decisions and ultimately **get better at golf**.

The product should not primarily be a GPS rangefinder, score tracker, or generic golf assistant. Those capabilities may eventually exist, but the central product is the **decision-making engine**:

> Given the golfer, the course, and the current situation, what should the golfer do?

The application should provide concise, practical advice that a golfer can actually use while standing over a shot.

---

## 2. Product Mission

Help golfers make better decisions on the course so that they can improve their golf over time.

The product should eventually understand:

- The golfer
- The golfer's clubs and distances
- The golfer's historical performance
- The golf course
- The current hole
- The current shot
- Hazards and trouble
- Wind
- Elevation
- Pin position
- The golfer's tendencies and actual performance data

The caddy should combine this information to recommend a strategy.

---

## 3. Core Product Philosophy

### The product is NOT:

- Primarily a GPS app
- Primarily a rangefinder
- Primarily a scorecard
- A generic chatbot with golf terminology
- A swing-analysis app
- A social golf app

### The product IS:

An intelligent decision-making system for golf.

The long-term goal is for a golfer to be able to ask:

> "What should I do here?"

and receive a recommendation based on the complete situation.

---

## 4. Initial MVP Philosophy

The first version should be extremely simple.

The goal of the MVP is **not** to build the complete vision.

The goal is to determine:

> Is the caddy advice actually useful to golfers?

Do not spend money on expensive infrastructure, premium golf-course data, sophisticated GPS, or unnecessary features before validating this.

The initial product should cost approximately **$0 to operate during development/testing** whenever possible.

---

## 5. Current $0 Technology Strategy

Use free tools and services during initial development.

Potential stack:

- Existing project/repository
- Cursor for development
- GitHub for source control
- React / Next.js or the project's existing frontend framework
- Vercel free tier for hosting
- Supabase free tier if a database/authentication layer is needed
- OpenGolfAPI for initial course data
- Mock/static course data where appropriate
- Mock caddy responses before introducing an LLM API

Avoid paying for:

- Premium golf-course APIs
- Large databases
- Expensive hosting
- Dedicated infrastructure
- AI API usage before the interaction design is established

The architecture should make it possible to replace free/mock services with more sophisticated services later.

---

## 6. Golf Course Data

### Initial API candidate

OpenGolfAPI is currently the primary candidate for initial course data.

Potential useful information includes:

- Courses
- Course search
- Course details
- Holes
- Par
- Tee information
- Hole distances
- Course coordinates
- Scorecard information

It can be used as an initial source without paying for premium course-data infrastructure.

### Important limitation

The MVP does NOT need extremely detailed course geometry.

Eventually, the product may need:

- Fairway boundaries
- Green polygons
- Bunkers
- Water
- Penalty areas
- Trees / trouble
- Elevation
- Green contours
- Exact pin positions
- Hole geometry

Those capabilities can be added later through a more sophisticated course-data provider.

Do not design the MVP around needing all of this immediately.

---

## 7. Initial User Experience

The application should be designed **mobile-first**.

The primary user will be:

> A golfer standing on a golf course holding a phone with one hand.

Therefore:

- Large touch targets
- Minimal typing
- High readability outdoors
- Clear hierarchy
- Minimal scrolling
- Fast interaction
- Portrait-first design
- Simple navigation
- Important information immediately visible
- Avoid unnecessary menus
- Avoid excessive text

Desktop should still work, but mobile is the primary experience.

The responsive design should be built correctly from the beginning rather than creating a desktop application and adapting it later.

---

## 8. Initial Application Structure

The landing page and application should be treated as two parts of the same product.

Conceptual structure:

```text
yourgolfcaddy.com

Landing Page
│
├── Sign Up / Login
│
├── Onboarding
│
└── Application
    │
    ├── Dashboard
    │
    ├── Player Profile
    │
    ├── Start Round
    │
    ├── Current Hole
    │
    └── Caddy
```

The exact routing and component architecture should be planned before implementation.

---

## 9. Landing Page

The landing page should remain clean and simple.

Current conceptual headline:

> Your Virtual Caddy

The landing page should communicate the core value quickly.

Avoid:

- Excessive copy
- Large feature lists
- Complicated explanations
- Overdesigned layouts

The user should understand that this is an intelligent golf caddy designed to help them make better decisions and improve.

There should be a clear primary CTA.

The existing waitlist functionality can remain part of the early validation process.

---

## 10. User Onboarding

The onboarding process should create a basic golfer profile.

Current desired inputs:

### Player Information

- Handicap
- Average score
- Driver carry
- Club distances
- Recent scores

The user specifically does **not** want the initial onboarding to ask for:

- Strengths
- Weaknesses
- Common miss

Those concepts may eventually be learned from actual performance data rather than manually entered.

The onboarding should feel quick rather than like filling out a long survey.

Potential framing:

> Build Your Caddy Profile

The information collected should be useful to the caddy without overwhelming the user.

---

## 11. Player Profile

The player profile should eventually contain information such as:

```text
Player
├── Handicap
├── Average Score
├── Driver Carry
├── Club Distances
└── Recent Scores
```

Later, the profile can become much more sophisticated.

Potential future data:

- Actual club performance
- Carry distribution
- Total distance distribution
- Shot dispersion
- Miss patterns
- Performance by lie
- Performance by distance
- Performance under pressure
- Performance by course
- Performance by hole type
- Historical round data

However:

**Do not build the learning system into the MVP.**

The MVP should simply store useful data so the architecture can support learning later.

---

## 12. Initial Caddy Interaction

The simplest useful caddy interaction can be based on structured inputs.

For example:

```text
Distance: 154 yards
Lie: Fairway
Wind: 8 mph left → right
Pin: Back right
```

The caddy might respond:

```text
7-iron

Aim 10 yards left of the pin.
Favor a small fade.

Primary miss: short-left.
Avoid long-right because of the bunker.

Reason:
The wind is moving the ball toward the right side and
the pin is already positioned toward the right.
```

The exact wording is not final.

The important concept is that the caddy gives:

1. Club
2. Target
3. Optional shot shape
4. Miss to avoid
5. Brief reason

The response should be concise enough to use during a real round.

---

## 13. Caddy Inputs

The initial system can use:

### Course Context

- Course
- Hole
- Par
- Yardage
- Basic hole information

### Current Situation

- Distance to target
- Lie
- Wind
- Pin position
- Potentially elevation

### Player Context

- Handicap
- Average score
- Club distances
- Recent scores

Eventually:

### Advanced Context

- Shot dispersion
- Actual club carry
- Actual performance
- Hazard geometry
- Green geometry
- Elevation
- Historical decisions
- Historical outcomes

---

## 14. AI Architecture

Do NOT train a custom AI model from scratch.

The intended architecture is:

```text
Golf Data
     +
Player Data
     +
Current Situation
     ↓
Decision / Calculation Layer
     ↓
AI Reasoning Layer
     ↓
Caddy Recommendation
```

The application should handle objective calculations whenever possible.

The AI should primarily handle:

- Strategy
- Reasoning
- Tradeoffs
- Recommendation
- Explanation

Do not rely on an LLM to perform critical golf calculations that can be handled deterministically by the application.

For example:

```text
Raw distance
+
Elevation
+
Wind
+
Other calculated factors
        ↓
Effective distance
        ↓
AI evaluates strategy
```

This separation will make the system more reliable and easier to improve.

---

## 15. Future Caddy Decision Engine

The long-term caddy should consider:

### Player

- Club carry
- Club consistency
- Dispersion
- Handicap
- Historical performance
- Recent performance

### Course

- Hole layout
- Fairway
- Hazards
- Green
- Pin position
- Elevation
- Trouble areas

### Environment

- Wind direction
- Wind speed
- Temperature
- Weather
- Course conditions

### Situation

- Current lie
- Distance
- Position relative to hazards
- Previous shot
- Current score
- Hole strategy

The goal is not simply:

> "What shot can reach the hole?"

It is:

> "What decision gives this golfer the best practical opportunity given their abilities and the situation?"

---

## 16. Caddy Recommendation Philosophy

The caddy should not automatically tell the golfer to attack the pin.

It should evaluate risk and reward.

The recommendation should consider:

- Probability of a successful shot
- Serious hazards
- Miss areas
- Player's actual capabilities
- Pin position
- Distance
- Wind
- Course position
- Expected next shot

The caddy should prioritize making a good decision over producing an aggressive-looking recommendation.

---

## 17. Future Learning System

The long-term vision includes a system that learns from the golfer's actual rounds.

For example:

```text
Recommendation
      ↓
Shot
      ↓
Outcome
      ↓
Stored Data
      ↓
Player Model
      ↓
Improved Future Recommendation
```

Example:

The system might eventually discover that a golfer consistently carries their 7-iron 162 yards rather than the 155 yards they initially entered.

Or:

The system might discover that a golfer's actual dispersion with a certain club is significantly larger than expected.

This could eventually allow the caddy to become personalized to the individual golfer.

However, this is **not part of the first MVP**.

The first version should collect useful data without attempting sophisticated machine learning.

---

## 18. GPS

GPS should eventually allow the app to determine:

- Current hole
- Current position
- Distance to green
- Distance to hazards
- Position relative to fairway
- Potential target locations

However, GPS should not be a prerequisite for validating the product.

The first version can use:

```text
Select Course
→ Select Hole
→ Enter Distance
→ Enter Situation
→ Get Recommendation
```

This allows the core caddy concept to be tested first.

GPS can be added after the decision-making experience has proven useful.

---

## 19. Course Tracking

A future course representation might look conceptually like:

```text
Course
│
├── Hole 1
│   ├── Tee coordinates
│   ├── Fairway geometry
│   ├── Green geometry
│   ├── Hazards
│   └── Pin location
│
├── Hole 2
│   └── ...
│
└── Hole 18
```

This level of detail is eventually useful for an intelligent golf caddy.

It is not required for the initial MVP.

---

## 20. Development Philosophy

Before writing significant amounts of code:

1. Define the product
2. Define the user flow
3. Define the application architecture
4. Define the data model
5. Define the caddy decision architecture
6. Define the interfaces between systems
7. Define the MVP
8. Then implement

Cursor should not independently invent major product architecture without first consulting this document and related architecture docs.

When generating code, favor:

- Simple architecture
- Clear components
- Strong separation of concerns
- Reusable components
- Explicit data models
- Easy replacement of external services
- Mobile-first design
- Minimal dependencies
- Free/low-cost infrastructure
- Maintainability over premature sophistication

---

## 21. MVP Development Phases

### Phase 1 — Interface

Build:

```text
Landing
→ Sign Up
→ Onboarding
→ Start Round
→ Caddy Screen
```

No real AI required.

No GPS required.

No sophisticated course data required.

### Phase 2 — Player Data

Implement:

- Player profile
- Handicap
- Average score
- Driver carry
- Club distances
- Recent scores

Persist this data.

### Phase 3 — Caddy Logic

Create a deterministic/mock caddy recommendation system.

Example:

```text
Inputs
→ Rules
→ Recommendation
```

This allows the UX to be tested before paying for AI API calls.

### Phase 4 — AI

Replace or supplement the mock decision engine with an LLM.

The AI should receive structured data rather than an unstructured blob of text.

### Phase 5 — Course Data

Integrate OpenGolfAPI or another appropriate course-data provider.

Start with:

- Course search
- Course selection
- Hole information
- Tee information
- Basic distances

### Phase 6 — GPS

Add GPS when the product has demonstrated that the caddy advice itself is useful.

### Phase 7 — Advanced Course Intelligence

Eventually add:

- Fairway geometry
- Hazards
- Green geometry
- Elevation
- Pin locations
- Detailed course strategy

### Phase 8 — Personalized Caddy

Eventually use accumulated shot/round data to build a personalized player model.

---

## 22. Important Product Constraint

Do not confuse the **vision** with the **MVP**.

The long-term product may require sophisticated:

- GPS
- Course geometry
- Data
- AI
- Player modeling
- Shot tracking

The first product does not.

The first question is simply:

> Will golfers find the caddy's decisions useful enough to use during a real round?

Everything about the MVP should support answering that question cheaply and quickly.

---

## 23. Architecture Planning Requirement

Before substantial implementation begins, create separate architecture documentation covering at least:

### Frontend Architecture

- Routes
- Pages
- Components
- Mobile/desktop behavior
- State management
- Navigation

### Backend Architecture

- API routes
- Authentication
- Database
- Business logic

### Data Architecture

- Player
- Course
- Hole
- Round
- Shot
- Caddy recommendation

### AI Architecture

- Inputs
- Calculation layer
- Prompt/context construction
- AI provider
- Structured response
- Validation
- Error handling

### Course Data Architecture

- External API
- Internal representation
- Caching
- Course lookup
- Hole data

### Future GPS Architecture

- Location acquisition
- Hole detection
- Distance calculations
- Course geometry

### Infrastructure

- Hosting
- Database
- Environment variables
- API keys
- Development vs production

These should be designed before implementing the corresponding features.

---

## 24. Guiding Principle

Build the smallest system that can answer the question:

> **"What should I do on this golf shot?"**

Then progressively give the system more context until it can answer that question better than a generic golf app.

Do not build complexity simply because it is technically possible.

The product should become more intelligent as more useful information becomes available.
