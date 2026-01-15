/**
 * Task Operation Error Message Mapping
 * Maps HTTP status codes and error details to user-friendly messages for task CRUD operations
 */

export function getTaskErrorMessage(error: any): string {
  const status = error?.status || error?.response?.status;
  const detail = error?.detail || error?.response?.data?.detail || error?.message || "";

  // Handle different error types
  if (typeof error === "string") {
    return mapTaskErrorDetail(error);
  }

  // Map by HTTP status code
  switch (status) {
    case 400:
      return mapTaskValidationError(detail) || "Invalid request. Please try again.";

    case 401:
      return "Your session expired. Please log in again.";

    case 404:
      return "Task not found. It may have been deleted.";

    case 409:
      return "Conflict. The task may have been modified. Refresh and try again.";

    case 422:
      return mapTaskValidationError(detail);

    case 500:
      return "Server error. Please try again later.";

    default:
      return mapTaskErrorDetail(detail) || "Failed to perform operation. Please try again.";
  }
}

function mapTaskValidationError(detail: any): string {
  if (!detail) return "";

  const detailStr = String(detail).toLowerCase();

  if (detailStr.includes("title")) {
    return "Title is required and cannot be empty.";
  }
  if (detailStr.includes("description")) {
    return "Description is invalid.";
  }
  if (detailStr.includes("completed")) {
    return "Invalid task status.";
  }
  if (detailStr.includes("required")) {
    return "Please fill in all required fields.";
  }
  if (detailStr.includes("length")) {
    return "Title is too long. Maximum 200 characters.";
  }

  return String(detail);
}

function mapTaskErrorDetail(detail: any): string {
  if (!detail) return "";

  const detailStr = String(detail).toLowerCase();

  if (detailStr.includes("not found")) {
    return "Task not found. It may have been deleted.";
  }
  if (detailStr.includes("already exists")) {
    return "A similar task already exists.";
  }
  if (detailStr.includes("invalid")) {
    return "Invalid task data. Please check and try again.";
  }
  if (detailStr.includes("unauthorized")) {
    return "You don't have permission to modify this task.";
  }

  return String(detail);
}

/**
 * Format error messages for display
 */
export function formatTaskError(error: any, context?: string): string {
  let message = getTaskErrorMessage(error);

  if (context === "create") {
    return `Failed to create task: ${message}`;
  }
  if (context === "update") {
    return `Failed to update task: ${message}`;
  }
  if (context === "delete") {
    return `Failed to delete task: ${message}`;
  }
  if (context === "toggle") {
    return `Failed to update task status: ${message}`;
  }

  return `Task operation failed: ${message}`;
}
