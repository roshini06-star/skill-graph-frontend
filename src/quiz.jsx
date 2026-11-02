

import { useEffect, useState } from 'react'
import { getQuiz, submitQuiz } from './api'

export default function Quiz({ skillId, onComplete, onClose }) {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  // Reset quiz whenever a different skill is selected
  useEffect(() => {
    setQuestions([])
    setAnswers({})
    setResult(null)
    setError('')
  }, [skillId])

  // Fetch quiz questions
  async function startQuiz() {
    try {
      setLoading(true)
      setError('')

      const data = await getQuiz(skillId)

      setQuestions(data.questions || [])

      if (!data.questions || data.questions.length === 0) {
        setError('No quiz questions are available for this skill.')
      }
    } catch (err) {
      setError(err.message || 'Could not load quiz.')
    } finally {
      setLoading(false)
    }
  }

  // Submit answers
  async function handleSubmit() {
    try {
      setSubmitting(true)
      setError('')

      const data = await submitQuiz(skillId, { answers })

      setResult(data)

      if (onComplete) {
        onComplete(data)
      }
    } catch (err) {
      const message = err.message || ''

      if (message.includes('409') ||
          message.toLowerCase().includes('already completed')) {
        setError(
          'You have already completed this skill! Please continue with your next unlocked skill.'
        )
      } else {
        setError(message || 'Could not submit quiz.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="quiz-section">

      <div className="quiz-header">
        <h2>{skillId} Quiz</h2>

        <button onClick={onClose}>
          ✕ Close
        </button>
      </div>

      {!questions.length && !result && (
        <div className="quiz-start">
          <p>Test your knowledge and earn XP!</p>

          <button
            onClick={startQuiz}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Start Quiz'}
          </button>
        </div>
      )}

      {questions.map((question, index) => (
        <div className="quiz-question" key={question.id}>

          <h3>
            {index + 1}. {question.question}
          </h3>

          {question.options.map((option) => (
            <label
              key={option}
              className="quiz-option"
            >
              <input
                type="radio"
                name={question.id}
                value={option}
                checked={answers[question.id] === option}
                onChange={() =>
                  setAnswers((previous) => ({
                    ...previous,
                    [question.id]: option,
                  }))
                }
                disabled={!!result}
              />

              {option}
            </label>
          ))}

        </div>
      ))}

      {questions.length > 0 && !result && (
        <button
          onClick={handleSubmit}
          disabled={
            submitting ||
            Object.keys(answers).length !== questions.length
          }
        >
          {submitting ? 'Submitting...' : 'Submit Answers'}
        </button>
      )}

      {error && (
        <div className="quiz-error">
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="quiz-result">

          <h2>
            {result.passed
              ? '🎉 Congratulations!'
              : 'Keep Practising!'}
          </h2>

          <p>Score: {result.score}%</p>

          <p>XP earned: {result.xp_earned}</p>

          <p>Total XP: {result.total_xp}</p>

          <p>
            Status: {result.passed ? 'Passed' : 'Not passed'}
          </p>

          {result.unlocked_skills?.length > 0 && (
            <p>
              Unlocked skills: {result.unlocked_skills.join(', ')}
            </p>
          )}

        </div>
      )}

    </section>
  )
}

