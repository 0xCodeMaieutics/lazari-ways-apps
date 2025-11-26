// tool name: storage paths build
// possible path for:
// employers applications documents path: employees/${employeeId}/applications/${applicationId}-${type}/documents/${docType}/${now}-${filename}
// employers profiles photo: employees/${employeeId}/profiles/photo/${now}-${data.foto.name}

import path from "node:path";

const constants = {
  USERS_EMPLOYEES: "users/employees",
  USERS_AGENTS: "users/agents",
  USERS_EMPLOYERS: "users/employers",

  APPLICATIONS: "applications",
  DOCUMENTS: "documents",
  PHOTOS: "photos",

  applications: {
    docType: {
      PASSPORT: "passport",
      LANGUAGE_CERTIFICATE: "language-certificate",
      STUDY_CERTIFICATE: "study-certificate",
      CERTIFICATE_OF_ENROLLMENT: "certificate",
    },
  },
};

export const keyBuilders = {
  employees: {
    application: {
      document: {
        // users/{userId}/employees/{employeeId}/applications/{applicationId}-{applicationType}/documents/{applicationDocType}/{now}-{filename}
        buildKey: ({
          id,
          docType,
          type,
          employeeId,
          filename,
          now,
        }: {
          id: string;
          employeeId: string;
          type: string; // STUDENT | ...
          docType: string;
          filename: string;
          now: number;
        }) => {
          return path.join(
            constants.USERS_EMPLOYEES,
            employeeId,
            constants.APPLICATIONS,
            `${id}-${type}`,
            constants.DOCUMENTS,
            docType,
            `${now}-${filename}`
          );
        },
      },
    },
    photo: {
      buildKey: ({
        employeeId,
        filename,
        now,
      }: {
        employeeId: string;
        filename: string;
        now: number;
      }) =>
        path.join(
          constants.USERS_EMPLOYEES,
          employeeId,
          constants.PHOTOS,
          `${now}-${filename}`
        ),
    },
  },
};

// users/agents
/**
 *
 * users/employees/
 *
 * */
// users/employers
