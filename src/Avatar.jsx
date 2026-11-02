import './Avatar.css'

export default function Avatar() {
  return (
    <div className="avatar-scene">
      <div className="avatar-glow" />
      <img
        className="avatar-character"
        src="https://api.dicebear.com/9.x/avataaars/svg?seed=Roshini&backgroundColor=b6e3f4"
        alt="Skill Graph student avatar"
      />
      <span className="avatar-sparkle sparkle-one">✦</span>
      <span className="avatar-sparkle sparkle-two">✧</span>
    </div>
  )
}