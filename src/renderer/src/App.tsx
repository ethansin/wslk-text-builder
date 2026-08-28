import { useState } from 'react'
import type { Template } from '@shared/types'
import { BrowseScreen } from './screens/BrowseScreen'
import { FillFormScreen } from './screens/FillFormScreen'
import { ResultScreen } from './screens/ResultScreen'

type ScreenState =
  | { screen: 'browse' }
  | { screen: 'fill'; template: Template }
  | { screen: 'result'; template: Template; answers: Record<string, string> }

export function App(): JSX.Element {
  const [state, setState] = useState<ScreenState>({ screen: 'browse' })

  const handleSelectTemplate = async (id: string): Promise<void> => {
    const template = await window.api.getTemplate(id)
    setState({ screen: 'fill', template })
  }

  if (state.screen === 'browse') {
    return <BrowseScreen onSelectTemplate={handleSelectTemplate} />
  }

  if (state.screen === 'fill') {
    return (
      <FillFormScreen
        template={state.template}
        onBack={() => setState({ screen: 'browse' })}
        onGenerate={(answers) => setState({ screen: 'result', template: state.template, answers })}
      />
    )
  }

  return (
    <ResultScreen
      template={state.template}
      answers={state.answers}
      onBack={() => setState({ screen: 'fill', template: state.template })}
      onStartOver={() => setState({ screen: 'browse' })}
    />
  )
}
