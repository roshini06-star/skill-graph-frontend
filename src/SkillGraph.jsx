
import { useEffect, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
} from '@xyflow/react'

import '@xyflow/react/dist/style.css'
import './SkillGraph.css'
import { getSkillGraph } from './api'

const descriptions = {
  python: 'Build your programming foundation with Python fundamentals.',
  pandas: 'Learn data manipulation and analysis using the Pandas library.',
  ml: 'Explore Machine Learning concepts and build intelligent models.',
}

const icons = {
  python: '🐍',
  pandas: '🐼',
  ml: '🧠',
}

function getNodeStyle(status) {
  const commonStyle = {
    borderRadius: '12px',
    padding: '14px',
    width: 180,
    fontWeight: 600,
  }

  if (status === 'completed') {
    return {
      ...commonStyle,
      background: '#dcfce7',
      color: '#166534',
      border: '2px solid #22c55e',
    }
  }

  if (status === 'unlocked') {
    return {
      ...commonStyle,
      background: '#e0f5ff',
      color: '#176b96',
      border: '2px solid #38a9dc',
    }
  }

  return {
    ...commonStyle,
    background: '#f0edf5',
    color: '#777080',
    border: '2px solid #c9c2d3',
  }
}

function getStatusLabel(status) {
  if (status === 'completed') return 'Completed'
  if (status === 'unlocked') return 'Unlocked'
  return 'Locked'
}

export default function SkillGraph({ refreshKey = 0 }) {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [selectedSkill, setSelectedSkill] = useState('python')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch or refresh the graph whenever refreshKey changes
  useEffect(() => {
    let isActive = true

    async function loadGraph() {
      try {
        setLoading(true)
        setError('')

        const graphData = await getSkillGraph()

        if (!graphData.nodes || !graphData.edges) {
          throw new Error('Invalid graph data received from backend.')
        }

        if (!isActive) return

        const formattedNodes = graphData.nodes.map((skill) => ({
          id: skill.id,
          position: skill.position,
          data: {
            label: `${icons[skill.id] || '⭐'} ${skill.label}`,
            skillName: skill.label,
            status: skill.status,
            xp: skill.xp ?? 0,
            prerequisites: skill.prerequisites || [],
          },
          style: getNodeStyle(skill.status),
        }))

        const formattedEdges = graphData.edges.map((edge) => ({
          ...edge,
          animated: true,
          style: {
            stroke: '#9875dc',
            strokeWidth: 2,
          },
        }))

        setNodes(formattedNodes)
        setEdges(formattedEdges)

        // Keep the selected skill if it still exists
        setSelectedSkill((previous) => {
          const stillExists = formattedNodes.some(
            (node) => node.id === previous
          )

          return stillExists
            ? previous
            : formattedNodes[0]?.id || ''
        })

      } catch (err) {
        if (isActive) {
          console.error('Failed to load skill graph:', err)
          setError(err.message || 'Unable to load skill graph.')
        }
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    loadGraph()

    return () => {
      isActive = false
    }
  }, [refreshKey])

  const selectedNode = nodes.find(
    (node) => node.id === selectedSkill
  )

  const selectedData = selectedNode?.data

  const prerequisites = selectedData?.prerequisites || []

  return (
    <section className="graph-section">

      <div className="graph-heading">
        <div>
          <p className="eyebrow">
            VISUALISE YOUR KNOWLEDGE
          </p>

          <h2>Interactive Skill Graph</h2>

          <p className="muted">
            Select a node to explore how your skills connect.
          </p>
        </div>

        <span className="graph-tag">
          ✦ Skill map
        </span>
      </div>

      {loading && (
        <p className="muted">
          Loading your skill graph...
        </p>
      )}

      {error && (
        <div>
          <p style={{ color: '#dc2626' }}>{error}</p>

          <button onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="graph-canvas">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              onNodeClick={(_, node) =>
                setSelectedSkill(node.id)
              }
              nodesDraggable
              nodesConnectable={false}
              elementsSelectable
            >
              <Background color="#ded8ef" gap={20} />

              <Controls />

              <MiniMap
                nodeColor={(node) => {
                  const status = node.data?.status

                  if (status === 'completed') return '#22c55e'
                  if (status === 'unlocked') return '#38a9dc'

                  return '#c9c2d3'
                }}
                maskColor="rgba(245,243,252,0.7)"
              />
            </ReactFlow>
          </div>

          {selectedData && (
            <div className="skill-detail">

              <div className="detail-icon">✦</div>

              <div>
                <p className="eyebrow">
                  SELECTED SKILL
                </p>

                <h3>{selectedData.skillName}</h3>

                <p className="muted">
                  {descriptions[selectedSkill] ||
                    'Explore and improve this skill.'}
                </p>

                <p>
                  <strong>Status:</strong>{' '}
                  {getStatusLabel(selectedData.status)}
                </p>

                <p>
                  <strong>XP:</strong>{' '}
                  {selectedData.xp}
                </p>

                <p>
                  <strong>Prerequisites:</strong>{' '}
                  {prerequisites.length > 0
                    ? prerequisites.join(', ')
                    : 'None'}
                </p>

              </div>
            </div>
          )}
        </>
      )}

    </section>
  )
}
