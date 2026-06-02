import { useState, type FormEvent } from 'react'

import type { CreateActivityInput } from '../../domain/activities'
import type { UseActivityOrganizerOptions } from './types'

export function useActivityOrganizer({
  activities,
  selectedActivityId,
  onCreateActivity,
  onSelectActivity,
}: UseActivityOrganizerOptions) {
  const [isCreating, setIsCreating] = useState(false)
  const [title, setTitle] = useState('')
  const [reminderText, setReminderText] = useState('')
  const [firstStepLabel, setFirstStepLabel] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState(
    'Organizador pronto para novas atividades.',
  )

  const selectedActivity = selectedActivityId
    ? activities.find((activity) => activity.id === selectedActivityId) ?? null
    : null

  const handleShowCreateForm = () => {
    setIsCreating(true)
    setFormError(null)
  }

  const handleCancelCreate = () => {
    setIsCreating(false)
    setFormError(null)
    setTitle('')
    setReminderText('')
    setFirstStepLabel('')
  }

  const handleSubmitCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedReminderText = reminderText.trim()
    const trimmedFirstStepLabel = firstStepLabel.trim()

    if (!trimmedTitle) {
      setFormError('Informe um titulo claro para a atividade.')
      return
    }

    const input: CreateActivityInput = {
      title: trimmedTitle,
    }

    if (trimmedReminderText) {
      input.reminderText = trimmedReminderText
    }

    if (trimmedFirstStepLabel) {
      input.steps = [{ label: trimmedFirstStepLabel }]
    }

    try {
      const createActivityResult = onCreateActivity(input)

      setFeedbackMessage(`Atividade criada: ${trimmedTitle}.`)

      const createdActivity = await createActivityResult
      const createdTitle = createdActivity?.title ?? trimmedTitle

      setTitle('')
      setReminderText('')
      setFirstStepLabel('')
      setFormError(null)
      setIsCreating(false)
      setFeedbackMessage(`Atividade criada: ${createdTitle}.`)

      if (createdActivity) {
        onSelectActivity(createdActivity.id)
      }
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'Nao foi possivel criar a atividade.',
      )
    }
  }

  return {
    feedbackMessage,
    firstStepLabel,
    formError,
    handleCancelCreate,
    handleShowCreateForm,
    handleSubmitCreate,
    isCreating,
    reminderText,
    selectedActivity,
    setFeedbackMessage,
    setFirstStepLabel,
    setReminderText,
    setTitle,
    title,
  }
}
