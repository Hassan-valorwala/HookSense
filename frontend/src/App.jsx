import { useState, useRef } from 'react'
import { Upload, Zap, CheckCircle, AlertCircle, BarChart2, Music, Film, Clock, RefreshCw, Clapperboard, AudioLines, TrendingUp } from 'lucide-react'

function ScoreRing({ score, size = 80, color = "#0066FF" }) {
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={6} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dashoffset 1s ease' }} />
      <text x="50%" y="50%" textAnchor="middle" dy="0.35em"
        fontSize={size * 0.22} fontWeight="700" fill="#0D0D0D">{score}</text>
    </svg>
  )
}

function ScoreBar({ label, score1, score2 }) {
  const best = score1 >= score2 ? 1 : 2
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{label}</span>
        <span className="font-semibold text-gray-700">{score1} vs {score2}</span>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: score1 + "%", background: best === 1 ? '#0066FF' : '#9CA3AF' }} />
        </div>
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: score2 + "%", background: best === 2 ? '#0066FF' : '#9CA3AF' }} />
        </div>
      </div>
    </div>
  )
}

function UploadZone({ label, file, onFile, disabled }) {
  const ref = useRef()
  const [dragging, setDragging] = useState(false)
  const [videoURL, setVideoURL] = useState(null)

  const handleFile = (f) => {
    if (f && f.type.startsWith('video/')) {
      onFile(f)
      setVideoURL(URL.createObjectURL(f))
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        onClick={() => !disabled && !file && ref.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center
          transition-all duration-200 overflow-hidden
          ${file ? 'border-green-400 bg-black' : dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        style={{ minHeight: '220px' }}
      >
        <input ref={ref} type="file" accept="video/*" className="hidden"
          onChange={(e) => handleFile(e.target.files[0])} disabled={disabled} />

        {videoURL ? (
          <video src={videoURL} controls className="w-full h-full object-cover rounded-2xl" style={{ maxHeight: '220px' }} />
        ) : (
          <div className="flex flex-col items-center p-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
              <Upload className="w-7 h-7 text-blue-500" />
            </div>
            <p className="font-semibold text-gray-800 text-sm">{label}</p>
            <p className="text-xs text-gray-400 mt-1">Drop your reel here or click to browse</p>
            <p className="text-xs text-gray-300 mt-1">MP4, MOV, MKV</p>
          </div>
        )}
      </div>

      {file && (
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-xs text-gray-600 truncate max-w-[160px]">{file.name}</span>
          </div>
          <button onClick={() => { onFile(null); setVideoURL(null) }}
            className="text-xs text-blue-500 hover:underline">Change</button>
        </div>
      )}
    </div>
  )
}

function StatPill({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
      <Icon className="w-4 h-4 text-gray-400" />
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-xs font-semibold text-gray-700">{value}</p>
      </div>
    </div>
  )
}

function ResultsPanel({ data }) {
  const { version1, version2, comparison, explanation } = data

  return (
    <div className="space-y-6">
      {/* Verdict Banner */}
      <div className="bg-black rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
            <Clapperboard className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <span className="text-xs font-semibold bg-blue-500 text-white px-2 py-0.5 rounded-full">
              {explanation.confidence_label}
            </span>
            <h2 className="text-xl font-bold mt-2 mb-2">{explanation.verdict_headline}</h2>
            <p className="text-gray-300 text-sm leading-relaxed">{explanation.why_winner_wins}</p>
          </div>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-2 gap-4">
        {[version1, version2].map((v, i) => {
          const isWinner = comparison.winner === v.label
          return (
            <div key={i} className={`bg-white rounded-2xl p-5 border-2 ${isWinner ? 'border-blue-500 shadow-md' : 'border-gray-100'}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400 font-medium">{v.label}</p>
                  {isWinner
                    ? <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">✓ Recommended</span>
                    : <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">Needs Work</span>
                  }
                </div>
                <ScoreRing score={v.overall_score} color={isWinner ? "#0066FF" : "#9CA3AF"} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <StatPill icon={Film} label="Hook" value={`${v.hook.hook_score}/100`} />
                <StatPill icon={BarChart2} label="Pacing" value={v.pacing.pacing_label} />
                <StatPill icon={Music} label="Audio" value={v.audio.audio_label} />
                <StatPill icon={Clock} label="Duration" value={`${v.duration_seconds}s`} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Score Breakdown */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 text-sm">Score Breakdown</h3>
        {comparison.dimensions.map((d, i) => (
          <div key={i} className="mb-4 last:mb-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600">{d.name}</span>
              <span className="text-xs text-blue-500 font-medium">{d.winner} wins</span>
            </div>
            <ScoreBar label="" score1={d.score1} score2={d.score2} />
            <p className="text-xs text-gray-400 mt-1">{d.insight}</p>
          </div>
        ))}
        <div className="flex gap-4 mt-4 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs text-gray-500">Version 1</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <span className="text-xs text-gray-500">Version 2</span>
          </div>
        </div>
      </div>

      {/* Tip + Weakness */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-xs font-bold text-red-500">What's Holding {comparison.loser} Back</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">{explanation.what_loser_lacks}</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-blue-500">Quick Tip for Your Creator</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">{explanation.quick_tip}</p>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [file1, setFile1] = useState(null)
  const [file2, setFile2] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState("")

  const canAnalyze = file1 && file2 && !loading

  const handleAnalyze = async () => {
    if (!canAnalyze) return
    setLoading(true)
    setError(null)
    setResult(null)

    const steps = ["Uploading videos...", "Analyzing hooks and pacing...", "Processing audio...", "Generating AI comparison...", "Almost done..."]
    let step = 0
    setProgress(steps[0])
    const interval = setInterval(() => {
      step = Math.min(step + 1, steps.length - 1)
      setProgress(steps[step])
    }, 4000)

    try {
      const form = new FormData()
      form.append("video1", file1)
      form.append("video2", file2)

      const res = await fetch("http://localhost:8000/analyze", { method: "POST", body: form })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || "Analysis failed")
      }
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      clearInterval(interval)
      setLoading(false)
      setProgress("")
    }
  }

  const handleReset = () => {
    setFile1(null)
    setFile2(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA]">

      {/* Nav */}
      <nav className="bg-black text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
            <Clapperboard className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">HookSense</span>
        </div>
        <span className="text-xs text-gray-400">AI Content Decision Tool</span>
        {result && (
          <button onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> New Analysis
          </button>
        )}
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10">

        {!result && (
          <>
            {/* Hero */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                Which reel should you post?
              </h1>
              <p className="text-gray-500 text-lg max-w-xl mx-auto mb-5">
                Upload two draft versions. HookSense analyzes your content and tells you which one will perform better — in plain English.
              </p>

              {/* Feature pills */}
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {[
                  { icon: Film, label: "Hook Analysis" },
                  { icon: BarChart2, label: "Pacing Detection" },
                  { icon: AudioLines, label: "Audio Scoring" },
                  { icon: TrendingUp, label: "AI Comparison" },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm">
                    <f.icon className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-xs font-medium text-gray-600">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How it works */}
            <div className="flex items-center justify-center gap-0 mb-8">
              {[
                { n: "1", label: "Upload 2 reels" },
                { n: "2", label: "AI analyzes both" },
                { n: "3", label: "Get plain-English verdict" },
              ].map((step, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{step.n}</span>
                    </div>
                    <span className="text-xs font-medium text-gray-700">{step.label}</span>
                  </div>
                  {i < 2 && (
                    <div className="px-1 text-gray-300 text-lg font-light">→</div>
                  )}
                </div>
              ))}
            </div>

            {/* Upload card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Step 1</span>
                <span className="text-xs text-gray-300">—</span>
                <span className="text-xs text-gray-500">Upload your two reel versions</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <UploadZone label="Version 1" file={file1} onFile={setFile1} disabled={loading} />
                <UploadZone label="Version 2" file={file2} onFile={setFile2} disabled={loading} />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-500 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                </div>
              )}

              <button onClick={handleAnalyze} disabled={!canAnalyze}
                className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-200
                  ${canAnalyze ? 'bg-black text-white hover:bg-gray-900' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
                    </svg>
                    {progress}
                  </span>
                ) : 'Analyse →'}
              </button>
            </div>
          </>
        )}

        {result && <ResultsPanel data={result} />}

        <p className="text-center text-xs text-gray-300 mt-10">
          HookSense · Bharat Academix CodeQuest 2026 · Mohammad Hassan Valorwala
        </p>
      </div>
    </div>
  )
}