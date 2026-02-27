# Backend API Reference

## User Routes

### Upload/Update Avatar

- **URL:** `PATCH /api/v1/users/:id/avatar`
- **Authentication:** required (user must be owner or admin)
- **Payload:** `multipart/form-data` containing a **single image file**.
  - Field name must be either `avatar` (preferred) or `file`.
  - Supported image types: `jpeg`, `jpg`, `png`, `webp`.
  - Maximum size: 5 MB.

If you provide a different field name, the request will still be rejected with
`400 Bad Request` and a descriptive message, thanks to improved error handling.

The uploaded file is processed in memory and forwarded to Cloudinary. The user
record will be updated with the new avatar URL and public ID.

---

*Note: other user endpoints are documented in code comments within
`src/controllers/user.controller.js`.*
