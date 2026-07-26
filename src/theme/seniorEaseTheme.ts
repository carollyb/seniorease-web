import { createDefaultPreferences } from '../domain/preferences'
import { createSeniorEaseTheme } from './createSeniorEaseTheme'

export const seniorEaseTheme = createSeniorEaseTheme(createDefaultPreferences())
