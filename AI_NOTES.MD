## 1. Which parts of the code were AI-generated vs. written by me

I used ChatGPT as a development assistant while building the project.

AI-assisted parts:
- Initial API endpoint structure.
- Suggestions for request and response models.
- Test case examples using pytest.
- README.md structure.
- Documentation (docstrings).

Implemented and finalized by me:
- Project structure.
- FastAPI application setup.
- JSON file storage implementation.
- Endpoint integration.
- Request validation.
- Error handling.
- Monthly summary endpoint.
- Debugging and fixing API issues.
- Testing every endpoint using Swagger UI.
- Running and fixing pytest failures.

---

## 2. What I validated, tested, or changed in the AI's output, and why

I reviewed every AI-generated suggestion before using it.

- **Delete expense endpoint**
  - **Validated:** Tested deleting both existing and non-existing expense IDs.
  - **Changed:** Added proper error handling using `HTTPException` with a 404 response when an expense was not found.
  - **Why:** To provide clear API behavior and appropriate HTTP status codes.

- **Monthly summary endpoint**
  - **Validated:** Tested the endpoint using expenses from different months.
  - **Changed:** Implemented logic to group expenses by month and calculate both the total number of expenses and the total amount.
  - **Why:** To implement the optional bonus feature in a simple and meaningful way.

- **Pytest test suite**
  - **Validated:** Ran the complete test suite using `pytest` and verified each endpoint.
  - **Changed:** Updated the tests after identifying that the category filtering endpoint was not working correctly.
  - **Why:** To ensure the tests matched the final API behavior and all required functionality was covered.

---

## 3. Any AI suggestion I decided not to use, and why

I chose not to use:
- Database integration (SQLite/PostgreSQL), because the assignment specified that a local JSON file was sufficient.
- Authentication and authorization, because they were outside the scope of the assignment.
- Docker support, because I selected the Monthly Summary endpoint as the optional bonus feature.
- Additional helper modules that were not required, to keep the project simple and aligned with the assignment.

