
import { useEffect, useState } from 'react'

import {
  BookOpen,
  Flame,
  Target,
  Trophy,
  UserRound,
  Code2,
  Database,
  Brain,
} from 'lucide-react'

import './App.css'
import SkillGraph from './SkillGraph'
import Avatar from './Avatar'
import Quiz from './Quiz'

import {
  getHealth,
  getProgress,
} from './api'

// Existing dashboard demo skills
const skills = [
  {
    name: 'Programming',
    level: 72,
    icon: Code2,
    color: '#8b5cf6',
  },
  {
    name: 'Database',
    level: 58,
    icon: Database,
    color: '#06b6d4',
  },
  {
    name: 'Problem Solving',
    level: 64,
    icon: Brain,
    color: '#f59e0b',
  },
]

// Actual learning path from the backend
const learningPath = [
  { id: 'python', name: 'Python' },
  { id: 'pandas', name: 'Pandas' },
  { id: 'ml', name: 'Machine Learning' },
]

export default function App() {
  const [selected, setSelected] = useState('Programming')

  const [backendStatus, setBackendStatus] =
    useState('Connecting...')

  const [progressData, setProgressData] =
    useState(null)

  const [progressLoading, setProgressLoading] =
    useState(true)

  const [showQuiz, setShowQuiz] =
    useState(false)

  const [quizSkill, setQuizSkill] =
    useState('python')

  // Connect to backend and load progress
  useEffect(() => {
    getHealth()
      .then((data) => {
        console.log('Backend connected successfully:', data)
        setBackendStatus('Connected')
      })
      .catch((error) => {
        console.error('Backend connection failed:', error)
        setBackendStatus('Connection failed')
      })

    refreshProgress()
  }, [])

  // Get latest progress from backend
  async function refreshProgress() {
    try {
      setProgressLoading(true)

      const data = await getProgress()

      console.log('Latest progress:', data)

      setProgressData(data)
    } catch (error) {
      console.error('Progress loading failed:', error)
    } finally {
      setProgressLoading(false)
    }
  }

  // Find the next skill that has not been completed
  const completedSkills = progressData?.completed_skills || []

  const nextSkill = learningPath.find(
    (skill) => !completedSkills.includes(skill.id)
  )

  // Open the quiz for the selected skill
  function openQuiz(skillId) {
    setQuizSkill(skillId)
    setShowQuiz(true)
  }

  return (
    <main className="dashboard">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <h2 className="brand">
          ✦ Skill Graph
        </h2>

        <p className="menu-label">
          WORKSPACE
        </p>

        <div className="nav active">
          ▦ Overview
        </div>

        <div className="nav">
          ◎ My Skills
        </div>

        <div className="nav">
          ⌘ Learning Path
        </div>

        <div className="nav">
          ♧ Community
        </div>

        <div className="profile">

          <div className="avatar">
            S
          </div>

          <div>
            <strong>Student</strong>
            <p>Skill explorer</p>
          </div>

        </div>

      </aside>

      {/* MAIN DASHBOARD */}
      <section className="main">

        {/* HEADER */}
        <header className="topbar">

          <div>

            <p className="eyebrow">
              YOUR LEARNING SPACE
            </p>

            <h1>
              Good evening! 👋
            </h1>

            <p className="muted">
              Every skill you build takes you one step forward.
            </p>

          </div>

          <button className="profile-button">
            <UserRound size={18} />
            My Profile
          </button>

        </header>

        {/* BACKEND STATUS */}
        <p className="muted">
          Backend status: {backendStatus}
        </p>

        {/* WELCOME SECTION */}
        <section className="welcome">

          <div className="welcome-left">

            <p className="eyebrow">
              YOUR JOURNEY STARTS HERE
            </p>

            <h2>
              Build skills. <span>Unlock potential.</span>
            </h2>

            <p>
              Discover what you know, explore what's next,
              and grow every day.
            </p>

            <button
              className="primary"
              onClick={() =>
                document
                  .getElementById('skills')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Explore my skills →
            </button>

            <div className="avatar-progress">

              <span>
                🔥 5 day streak
              </span>

              <span>
                ⭐ {progressLoading
                  ? '...'
                  : progressData?.total_xp ?? 0} XP
              </span>

            </div>

          </div>

          <div className="welcome-right">
            <Avatar />
          </div>

        </section>

        {/* STATISTICS */}
        <section className="stats">

          <article className="stat-card">

            <span className="stat-icon purple">
              <BookOpen />
            </span>

            <p>Skills completed</p>

            <h2>
              {progressLoading
                ? '...'
                : progressData?.completed_count ?? 0}
            </h2>

            <small>
              Keep discovering
            </small>

          </article>

          <article className="stat-card">

            <span className="stat-icon orange">
              <Flame />
            </span>

            <p>Learning streak</p>

            <h2>5 days</h2>

            <small>
              Sample demo value
            </small>

          </article>

          <article className="stat-card">

            <span className="stat-icon cyan">
              <Target />
            </span>

            <p>Total skills</p>

            <h2>
              {progressLoading
                ? '...'
                : progressData?.total_skills ?? 0}
            </h2>

            <small>
              Skills available
            </small>

          </article>

          <article className="stat-card">

            <span className="stat-icon pink">
              <Trophy />
            </span>

            <p>XP earned</p>

            <h2>
              {progressLoading
                ? '...'
                : progressData?.total_xp ?? 0}
            </h2>

            <small>
              Real backend data
            </small>

          </article>

        </section>

        {/* SKILLS SECTION */}
        <section
          className="skills-section"
          id="skills"
        >

          <div className="section-heading">

            <div>

              <p className="eyebrow">
                KEEP GROWING
              </p>

              <h2>
                Your skill landscape
              </h2>

            </div>

            <span className="muted">
              Sample demo data
            </span>

          </div>

          <div className="skill-grid">

            {skills.map(
              ({ name, level, icon: Icon, color }) => (

                <button
                  className={`skill-card ${
                    selected === name ? 'chosen' : ''
                  }`}
                  key={name}
                  onClick={() => setSelected(name)}
                >

                  <span
                    className="skill-icon"
                    style={{
                      color,
                      background: `${color}18`,
                    }}
                  >
                    <Icon />
                  </span>

                  <span className="skill-name">
                    {name}
                  </span>

                  <strong>
                    {level}%
                  </strong>

                  <span className="progress">

                    <span
                      style={{
                        width: `${level}%`,
                        background: color,
                      }}
                    />

                  </span>

                  <small>
                    {selected === name
                      ? 'Currently selected'
                      : 'Click to explore'}
                  </small>

                </button>

              )
            )}

          </div>

          <div className="next-step">

            <div>

              <p className="eyebrow">
                YOUR NEXT STEP
              </p>

              <h3>
                Small progress adds up.
              </h3>

              <p className="muted">
                Choose a skill above and make a plan to improve it.
              </p>

            </div>

            <span className="next-symbol">
              ↗
            </span>

          </div>

        </section>

        {/* LIVE SKILL GRAPH */}
        <SkillGraph />

        {/* DYNAMIC QUIZ LAUNCH SECTION */}
        <section className="quiz-launch">

          <div>

            <p className="eyebrow">
              TEST YOUR KNOWLEDGE
            </p>

            <h2>
              {nextSkill
                ? `Ready for ${nextSkill.name}?`
                : 'Amazing work!'}
            </h2>

            <p className="muted">

              {progressLoading
                ? 'Loading your learning progress...'
                : nextSkill
                  ? `${nextSkill.name} is your next skill. Complete its quiz to earn XP and unlock the next stage.`
                  : 'You have completed all available skills!'}

            </p>

          </div>

          <button
            className="primary"
            disabled={progressLoading || !nextSkill}
            onClick={() => {
              if (nextSkill) {
                openQuiz(nextSkill.id)
              }
            }}
          >
            {progressLoading
              ? 'Loading...'
              : nextSkill
                ? `Start ${nextSkill.name} Quiz →`
                : 'All Skills Completed'}
          </button>

        </section>

        {/* QUIZ COMPONENT */}
        {showQuiz && (

          <Quiz
            key={quizSkill}
            skillId={quizSkill}
            onClose={() => setShowQuiz(false)}
            onComplete={refreshProgress}
          />

        )}

        {/* FOOTER */}
        <footer>
          Skill Graph · Learn with purpose, grow with confidence.
        </footer>

      </section>

    </main>
  )
}
