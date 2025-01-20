# PS-Hub | PlayStation Management System

## Overview

The **PS-Hub** is a web application designed to efficiently manage PlayStation gaming rooms, buffet services, and financial tracking. This system is tailored for businesses that require robust management of gaming sessions, buffet services, and detailed revenue tracking.

## Features

### User Roles

#### 1. Super Admin
- **Responsibilities:**
  - Create accounts for Admin users.
  - Activate or deactivate Admin accounts.

#### 2. Admin
- **Responsibilities:**
  - **Room Management:**
    - Add, edit, and remove gaming rooms.
    - Reserve rooms for gaming sessions.
      - **Reservation Types:** Open Time or Dedicated Time (e.g., 1 hour, 1 hour 30 minutes).
      - Track timers for dedicated gaming sessions.
      - Sell items from the buffet for customers who are in the room.
      - Extend room time or check out before or after time ends.

  - **Buffet Management:**
    - Add, edit, and remove buffet items.
    - Offer discounted prices for workers.
    - Sell buffet items to customers during gaming sessions.

  - **Invoice Management:**
    - View and manage invoices for:
      - Gaming sessions.
      - Buffet purchases.
      - External purchases (e.g., workers buying coffee without gaming).
    - Add external invoices.
    - Delete invoices as needed.

  - **Revenue Tracking:**
    - View revenues separately for gaming sessions and buffet items.
    - Generate revenue reports for custom date ranges.
    - Download periodic revenue sheets containing:
      - Start and end dates.
      - First and last invoice dates.
      - Total revenues from gaming sessions.
      - Total revenues from buffet sales.

  - **Security Features:**
    - Admin must re-enter their password before performing sensitive actions, such as deleting or editing rooms, buffet items, or invoices.

### Notes
- Some features have been implemented inconsistently due to project interruptions caused by college responsibilities and other factors.

---

## Technologies Used

- **Framework:** Next.js - Typescript
- **Styling:** TailwindCSS
- **Database ORM:** Prisma
- **Database:** MongoDB (Atlas)

---

## Usage

1. **Super Admin Tasks:**
   - Log in with the Super Admin account.
   - Create accounts for Admin users.
   - Activate or deactivate Admin accounts as needed.

2. **Admin Tasks:**
   - Log in with an Admin account.
   - Manage rooms, buffet items, invoices, and revenues through the intuitive dashboard.
   - Use password re-entry to confirm critical actions like deletion or edits.

3. **Generating Revenue Reports:**
   - Navigate to the `Revenues` section.
   - Select a custom date range.
   - Download the detailed report as a sheet for further analysis.

---

## Future Improvements

- Standardize feature implementations across all modules.
- Add real-time notifications for room reservations and buffet sales.
- Enhance security with multi-factor authentication (MFA).
- Implement automated testing for critical workflows.

---

## Contributing

We welcome contributions! To contribute:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed explanation of your changes.

---

## Contact

For questions or support, feel free to reach out:
- **Email:** osamaeid0101@gmail.com
- **GitHub:** [OsamaEid1](https://github.com/OsamaEid1)
