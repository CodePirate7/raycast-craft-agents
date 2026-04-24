/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Workspace Root - Absolute path to your Craft Agents workspace folder (contains sessions/, sources/, skills/). */
  "workspaceRoot": string,
  /** Global Skills Dir - Path to global skills directory (merged with workspace skills). */
  "globalSkillsDir": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `new-session` command */
  export type NewSession = ExtensionPreferences & {}
  /** Preferences accessible in the `new-session-quick` command */
  export type NewSessionQuick = ExtensionPreferences & {}
  /** Preferences accessible in the `quick-ask` command */
  export type QuickAsk = ExtensionPreferences & {}
  /** Preferences accessible in the `resume-session` command */
  export type ResumeSession = ExtensionPreferences & {}
  /** Preferences accessible in the `flagged-sessions` command */
  export type FlaggedSessions = ExtensionPreferences & {}
  /** Preferences accessible in the `open-view` command */
  export type OpenView = ExtensionPreferences & {}
  /** Preferences accessible in the `open-source` command */
  export type OpenSource = ExtensionPreferences & {}
  /** Preferences accessible in the `open-skill` command */
  export type OpenSkill = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `new-session` command */
  export type NewSession = {
  /** Initial message (optional) */
  "input": string,
  /** plan | acceptEdits | bypass | default */
  "mode": string
}
  /** Arguments passed to the `new-session-quick` command */
  export type NewSessionQuick = {}
  /** Arguments passed to the `quick-ask` command */
  export type QuickAsk = {
  /** What to ask */
  "input": string
}
  /** Arguments passed to the `resume-session` command */
  export type ResumeSession = {}
  /** Arguments passed to the `flagged-sessions` command */
  export type FlaggedSessions = {}
  /** Arguments passed to the `open-view` command */
  export type OpenView = {}
  /** Arguments passed to the `open-source` command */
  export type OpenSource = {}
  /** Arguments passed to the `open-skill` command */
  export type OpenSkill = {}
}

