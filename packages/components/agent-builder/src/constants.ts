// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import type { CustomNodeDefinition } from './types';

export const DEFAULT_CUSTOM_NODES: CustomNodeDefinition[] = [
  {
    type: 'agentName',
    label: 'Agent Name',
    description: 'Give the agent an identity so LLMs can reference it.',
    placeholder: 'e.g. Spatial Planning Copilot',
  },
  {
    type: 'agentDescription',
    label: 'Agent Description',
    description: 'Summarize what the workflow does and which tools it needs.',
    placeholder: 'Describe the orchestration and expectations...',
  },
  {
    type: 'agentResult',
    label: 'Result Blueprint',
    description: 'Clarify what output the agent should return to the caller.',
    placeholder: 'Structured JSON object, markdown table, etc.',
  },
  {
    type: 'agentError',
    label: 'Error Guidance',
    description: 'Document possible failures and how they should be surfaced.',
    placeholder: 'List potential errors or fallback responses.',
  },
];
