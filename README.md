

This contains everything you need to run your app locally.


## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
3. Run the app:
   `npm run dev`


Account Role	Email Address	Password	Functionality

Director (ADMIN)	admin@wealthfarm.ng	WealthFarm@2026	
Full administrative control, asset publishing, order status updates, and task evidence audits.
Investor (USER)	investor@wealthfarm.ng	WealthFarm@2026	
Asset catalog inspection, order initiation, Paystack checkout, task submission, and learning access.

To try either dashboard, start the app with `npm run dev`, choose **Demo Dashboards** in the navigation, then select **Commercial User (USER)** or **Director (ADMIN)** on the sign-in page. Demo access authenticates through the normal login API using the seeded accounts above.