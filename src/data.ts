export const hardcodedApps = [
    { pageId: 'vPpRj1UIYGbmXCP98qCi', name: 'DataSync Pro', version: '3.2', description: 'Real-time data synchronization across your stack.', publisher: 'Acme Corp', category: 'Data', price: 0, status: 'Stable', supportedVersions: ['2022 R1', '2022 R2', '2023 R1'], requiredProduct: 'DataHub', verified: true },
    { pageId: 'BPx7cytZWiZAvZBhBtkz', name: 'LogVault', version: '1.8', description: 'Centralized logging and monitoring for teams.', publisher: 'DevTools Inc', category: 'Monitoring', price: 299, status: 'Stable', supportedVersions: ['2021 R2', '2022 R1', '2022 R2'], requiredProduct: 'Core', verified: true },
    { pageId: 'DMIXsN5XQCXbjxgBMkv9', name: 'FormForge', version: '2.1', description: 'Build dynamic forms with validation and workflows.', publisher: 'Acme Corp', category: 'Productivity', price: 0, status: 'Beta', supportedVersions: ['2023 R1', '2023 R2'], requiredProduct: 'Workflow', verified: false },
    { pageId: 'FhCfcEGkAT5TQzg3poQJ', name: 'APIShield', version: '4.0', description: 'Rate limiting and security layer for REST APIs.', publisher: 'SecureNet', category: 'Security', price: 1200, status: 'Stable', supportedVersions: ['2021 R1', '2022 R1', '2023 R1'], requiredProduct: 'Gateway', verified: true },
    { pageId: 'O908XYZkD8nHfGhJNHvJ', name: 'ChartFlow', version: '2.6', description: 'Drag-and-drop data visualization builder.', publisher: 'VisualBI', category: 'Analytics', price: 499, status: 'Stable', supportedVersions: ['2022 R1', '2022 R2', '2023 R1', '2023 R2'], requiredProduct: 'Analytics Suite', verified: true },
    { pageId: 'okTy21DD3XTI7aXdOxOC', name: 'DeployBot', version: '5.1', description: 'One-click deployments to any cloud provider.', publisher: 'DevTools Inc', category: 'DevOps', price: 3500, status: 'Stable', supportedVersions: ['2021 R1', '2021 R2', '2022 R1', '2022 R2'], requiredProduct: 'Cloud', verified: true },
    { pageId: 'RncFSAJLtyAr2iCpzxPi', name: 'NoteStack', version: '1.3', description: 'Collaborative note-taking with markdown support.', publisher: 'CollabHQ', category: 'Productivity', price: 0, status: 'Stable', supportedVersions: ['2023 R1', '2023 R2', '2024 R1'], requiredProduct: 'Core', verified: false },
    { pageId: 'tYnElc5Bk4MAw2AiDmRO', name: 'QueryMind', version: '2.0', description: 'AI-powered SQL query assistant for analysts.', publisher: 'VisualBI', category: 'Analytics', price: 899, status: 'Beta', supportedVersions: ['2023 R1', '2023 R2'], requiredProduct: 'Analytics Suite', verified: false },
    { pageId: 'GEquIXycO0OukF8DRpxk', name: 'VaultKey', version: '3.5', description: 'Secrets management and environment variable storage.', publisher: 'SecureNet', category: 'Security', price: 599, status: 'Stable', supportedVersions: ['2021 R2', '2022 R1', '2022 R2', '2023 R1'], requiredProduct: 'Gateway', verified: true },
    { pageId: 'xI8chgWy311317aDqspp', name: 'PipelineX', version: '1.1', description: 'Visual ETL pipeline builder for data teams.', publisher: 'Acme Corp', category: 'Data', price: 2400, status: 'Beta', supportedVersions: ['2023 R1', '2023 R2'], requiredProduct: 'DataHub', verified: false },
    { pageId: '934DMN1WPWdeakCYYp5n', name: 'TaskBridge', version: '4.3', description: 'Connect and sync tasks across Jira, Linear, and Asana.', publisher: 'CollabHQ', category: 'Productivity', price: 149, status: 'Stable', supportedVersions: ['2022 R1', '2022 R2', '2023 R1', '2023 R2', '2024 R1'], requiredProduct: 'Workflow', verified: true },
    { pageId: 'kAtYUv2T7F5PKn1uWjT2', name: 'ErrorRadar', version: '2.2', description: 'Real-time error tracking with smart grouping.', publisher: 'DevTools Inc', category: 'Monitoring', price: 0, status: 'Beta', supportedVersions: ['2023 R1', '2023 R2', '2024 R1'], requiredProduct: 'Core', verified: false },
];

export type App = typeof hardcodedApps[0] & { pageUrl: string; editorUrl: string };

const avatarColors = ['#4f46e5', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed', '#db2777', '#0284c7'];

export const getAvatarColor = (name: string) =>
    avatarColors[Math.abs([...name].reduce((h, c) => c.charCodeAt(0) + ((h << 5) - h), 0)) % avatarColors.length];
