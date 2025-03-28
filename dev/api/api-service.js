const BACKEND_HOST = 'http://localhost:8080';
const BASE_URL = `${BACKEND_HOST}/api/v1/templates`;

export async function createNewTemplateOrUpdate(template) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(template),
  });

  if (response.status === 400) {
    const errorResponse = await response.json();
    console.warn(`Bad request! Check the template data: ${errorResponse}`);
    return errorResponse.errors;
  }

  if (!response.ok) {
    throw new Error(
      `HTTP error during saving new template! Status: ${response.status}`
    );
  }

  return await response.json();
}

export async function getTemplatesSummary() {
  const response = await fetch(BASE_URL);

  if (!response.ok) {
    throw new Error(
      `HTTP error during getting all template summaries! Status: ${response.status}`
    );
  }

  return await response.json();
}

export async function getTemplateById(templateId) {
  const response = await fetch(`${BASE_URL}/${templateId}`);

  if (!response.ok) {
    throw new Error(
      `HTTP error during getting template by id! Status: ${response.status}`
    );
  }

  return await response.json();
}

export async function deleteTemplateById(templateId) {
  const response = await fetch(`${BASE_URL}/${templateId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(
      `HTTP error during deleting template by id! Status: ${response.status}`
    );
  }

  return await response;
}
