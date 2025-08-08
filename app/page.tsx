"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Zap, Settings, Sparkles, CheckCircle, Target, Edit3, Brain, Cpu } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function WrongCorrect() {
  const [text, setText] = useState("")
  const [isEnabled, setIsEnabled] = useState(true)
  const [corrections, setCorrections] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [glitchText, setGlitchText] = useState("WrongCorrect™")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Glitch effect for title
  useEffect(() => {
    const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    const originalText = "WrongCorrect™"
    
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance to glitch
        let glitched = originalText
        const numGlitches = Math.floor(Math.random() * 3) + 1
        
        for (let i = 0; i < numGlitches; i++) {
          const pos = Math.floor(Math.random() * originalText.length)
          const glitchChar = glitchChars[Math.floor(Math.random() * glitchChars.length)]
          glitched = glitched.substring(0, pos) + glitchChar + glitched.substring(pos + 1)
        }
        
        setGlitchText(glitched)
        setTimeout(() => setGlitchText(originalText), 100)
      }
    }, 2000)

    return () => clearInterval(glitchInterval)
  }, [])

  // Common letter swaps that happen in typing
  const commonSwaps = {
    'a': ['s', 'q', 'w'],
    'b': ['v', 'n', 'g'],
    'c': ['x', 'v', 'd'],
    'd': ['s', 'f', 'c'],
    'e': ['w', 'r', 'd'],
    'f': ['d', 'g', 'v'],
    'g': ['f', 'h', 'b'],
    'h': ['g', 'j', 'n'],
    'i': ['u', 'o', 'k'],
    'j': ['h', 'k', 'm'],
    'k': ['j', 'l', 'i'],
    'l': ['k', 'o', 'p'],
    'm': ['n', 'j', 'k'],
    'n': ['b', 'm', 'h'],
    'o': ['i', 'p', 'l'],
    'p': ['o', 'l'],
    'q': ['w', 'a'],
    'r': ['e', 't', 'f'],
    's': ['a', 'd', 'w'],
    't': ['r', 'y', 'g'],
    'u': ['y', 'i', 'j'],
    'v': ['c', 'f', 'b'],
    'w': ['q', 'e', 's'],
    'x': ['z', 'c', 's'],
    'y': ['t', 'u', 'h'],
    'z': ['x', 'a']
  }

  // Generate believable typos for any word
  const generateTypos = (word: string): string[] => {
    if (word.length < 2) return [word]
    
    const typos = []
    const lowerWord = word.toLowerCase()
    
    // 1. Adjacent letter swaps (transpose)
    for (let i = 0; i < lowerWord.length - 1; i++) {
      const swapped = lowerWord.substring(0, i) + 
                     lowerWord[i + 1] + 
                     lowerWord[i] + 
                     lowerWord.substring(i + 2)
      typos.push(swapped)
    }
    
    // 2. Missing letters (deletion)
    for (let i = 0; i < lowerWord.length; i++) {
      const deleted = lowerWord.substring(0, i) + lowerWord.substring(i + 1)
      if (deleted.length > 0) typos.push(deleted)
    }
    
    // 3. Extra letters (insertion)
    for (let i = 0; i <= lowerWord.length; i++) {
      const char = lowerWord[i] || lowerWord[i-1] || 'e'
      const doubled = lowerWord.substring(0, i) + char + lowerWord.substring(i)
      typos.push(doubled)
    }
    
    // 4. Wrong letters (substitution with nearby keys)
    for (let i = 0; i < lowerWord.length; i++) {
      const currentChar = lowerWord[i]
      const nearbyKeys = commonSwaps[currentChar] || ['e', 'a', 'o']
      
      nearbyKeys.forEach(replacement => {
        const substituted = lowerWord.substring(0, i) + 
                           replacement + 
                           lowerWord.substring(i + 1)
        typos.push(substituted)
      })
    }
    
    // 5. Common ending mistakes
    if (lowerWord.endsWith('ing')) {
      typos.push(lowerWord.replace('ing', 'ign'))
      typos.push(lowerWord.replace('ing', 'ingg'))
    }
    if (lowerWord.endsWith('tion')) {
      typos.push(lowerWord.replace('tion', 'toin'))
      typos.push(lowerWord.replace('tion', 'shun'))
    }
    if (lowerWord.endsWith('ly')) {
      typos.push(lowerWord.replace('ly', 'ley'))
    }
    
    // 6. Double letter mistakes
    const doubleLetterWord = lowerWord.replace(/(.)\1/g, '$1')
    if (doubleLetterWord !== lowerWord) {
      typos.push(doubleLetterWord)
    }
    
    // Filter out duplicates and the original word
    return [...new Set(typos)].filter(typo => typo !== lowerWord && typo.length > 0)
  }

  const getRandomTypo = (word: string): string => {
    const typos = generateTypos(word)
    if (typos.length === 0) return word
    return typos[Math.floor(Math.random() * typos.length)]
  }

  const preserveCase = (original: string, modified: string): string => {
    if (original.length === 0 || modified.length === 0) return modified
    
    let result = ''
    for (let i = 0; i < modified.length; i++) {
      const originalChar = original[i] || original[original.length - 1]
      const modifiedChar = modified[i]
      
      if (originalChar === originalChar.toUpperCase()) {
        result += modifiedChar.toUpperCase()
      } else {
        result += modifiedChar.toLowerCase()
      }
    }
    return result
  }

  const shouldCorrectWord = (word: string): boolean => {
  // Skip very short words, numbers, and special characters
  if (word.length < 2) return false
  if (/^\d+$/.test(word)) return false // Skip numbers
  if (!/^[a-zA-Z]+$/.test(word)) return false // Skip non-alphabetic
  
  // Only skip single letters now - corrupt almost everything else!
  const skipWords = ['a', 'i']
  if (skipWords.includes(word.toLowerCase())) return false
  
  return true
}

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setText(newText)
  }

  const resetText = () => {
    setText("")
    setCorrections(0)
  }

  const sampleTexts = [
    "The quintessential paradigm of artificial intelligence encompasses multidimensional algorithmic architectures, sophisticated neural network topologies, and revolutionary computational methodologies that fundamentally transform contemporary technological infrastructures through unprecedented optimization techniques.",
    "Implementing comprehensive cybersecurity protocols requires meticulous authentication mechanisms, cryptographic encryption algorithms, vulnerability assessment procedures, and sophisticated intrusion detection systems to safeguard organizational digital assets against malicious adversaries.",
    "Advanced pharmaceutical biotechnology leverages cutting-edge molecular engineering, sophisticated biochemical synthesis, revolutionary therapeutic interventions, and comprehensive clinical trial methodologies to develop groundbreaking medical treatments for complex pathological conditions.",
    "Contemporary quantum computing architectures utilize superposition principles, entanglement phenomena, sophisticated qubit manipulation techniques, and revolutionary error correction algorithms to achieve exponential computational advantages over classical computing paradigms.",
    "Sophisticated machine learning implementations incorporate convolutional neural networks, recurrent architectures, transformer mechanisms, attention algorithms, gradient optimization techniques, and comprehensive regularization methodologies for achieving unprecedented predictive accuracy.",
    "Revolutionary blockchain technologies implement decentralized consensus mechanisms, cryptographic hash functions, sophisticated smart contract architectures, and comprehensive distributed ledger systems to establish trustless peer-to-peer transaction networks.",
    "Advanced aerospace engineering encompasses aerodynamic optimization, propulsion system integration, sophisticated avionics architectures, comprehensive structural analysis methodologies, and revolutionary materials science applications for next-generation aircraft development.",
    "Comprehensive environmental sustainability initiatives require sophisticated ecosystem monitoring, biodiversity conservation strategies, renewable energy optimization, carbon sequestration technologies, and revolutionary circular economy implementation frameworks."
  ]

  const loadSampleText = () => {
    const sample = sampleTexts[Math.floor(Math.random() * sampleTexts.length)]
    setText(sample)
  }

  const forceCorrectText = async () => {
  if (!text.trim()) return

  setIsProcessing(true)
  
  // Add dramatic delay for effect
  await new Promise(resolve => setTimeout(resolve, 800))

  const words = text.split(/(\s+|[^\w\s])/g)
  let correctionsMade = 0

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    
    if (shouldCorrectWord(word)) {
      let corruptedWord = word
      
      // Apply MULTIPLE corruption layers for maximum chaos
      const numCorruptions = Math.floor(Math.random() * 4) + 2 // 2-5 corruptions per word
      
      for (let j = 0; j < numCorruptions; j++) {
        const corruptionType = Math.floor(Math.random() * 8)
        
        switch (corruptionType) {
          case 0: // Letter swaps (multiple)
            if (corruptedWord.length > 3) {
              const pos1 = Math.floor(Math.random() * (corruptedWord.length - 1))
              const pos2 = pos1 + 1
              corruptedWord = corruptedWord.substring(0, pos1) + 
                           corruptedWord[pos2] + 
                           corruptedWord[pos1] + 
                           corruptedWord.substring(pos2 + 1)
            }
            break
            
          case 1: // Random deletions
            if (corruptedWord.length > 3) {
              const pos = Math.floor(Math.random() * corruptedWord.length)
              corruptedWord = corruptedWord.substring(0, pos) + corruptedWord.substring(pos + 1)
            }
            break
            
          case 2: // Random insertions
            const insertPos = Math.floor(Math.random() * (corruptedWord.length + 1))
            const insertChar = corruptedWord[Math.floor(Math.random() * corruptedWord.length)] || 'e'
            corruptedWord = corruptedWord.substring(0, insertPos) + insertChar + corruptedWord.substring(insertPos)
            break
            
          case 3: // Keyboard neighbor substitution
            if (corruptedWord.length > 0) {
              const pos = Math.floor(Math.random() * corruptedWord.length)
              const currentChar = corruptedWord[pos].toLowerCase()
              const neighbors = commonSwaps[currentChar] || ['e', 'a', 'o', 'i', 'u']
              const replacement = neighbors[Math.floor(Math.random() * neighbors.length)]
              corruptedWord = corruptedWord.substring(0, pos) + replacement + corruptedWord.substring(pos + 1)
            }
            break
            
          case 4: // Vowel chaos
            corruptedWord = corruptedWord.replace(/[aeiou]/gi, () => {
              const vowels = ['a', 'e', 'i', 'o', 'u']
              return vowels[Math.floor(Math.random() * vowels.length)]
            })
            break
            
          case 5: // Double letters randomly
            if (corruptedWord.length > 2) {
              const pos = Math.floor(Math.random() * corruptedWord.length)
              corruptedWord = corruptedWord.substring(0, pos) + 
                           corruptedWord[pos] + 
                           corruptedWord.substring(pos)
            }
            break
            
          case 6: // Scramble middle section
            if (corruptedWord.length > 4) {
              const start = 1
              const end = corruptedWord.length - 1
              const middle = corruptedWord.substring(start, end).split('')
              // Fisher-Yates shuffle
              for (let k = middle.length - 1; k > 0; k--) {
                const j = Math.floor(Math.random() * (k + 1))
                ;[middle[k], middle[j]] = [middle[j], middle[k]]
              }
              corruptedWord = corruptedWord[0] + middle.join('') + corruptedWord[corruptedWord.length - 1]
            }
            break
            
          case 7: // Common typo patterns
            corruptedWord = corruptedWord
              .replace(/tion/g, 'toin')
              .replace(/sion/g, 'shun')
              .replace(/ing/g, 'ign')
              .replace(/ough/g, 'ouhg')
              .replace(/ight/g, 'ihgt')
              .replace(/ence/g, 'ance')
              .replace(/ance/g, 'ence')
              .replace(/ie/g, 'ei')
              .replace(/ei/g, 'ie')
            break
        }
      }
      
      // Apply case preservation
      const finalWord = preserveCase(word, corruptedWord)
      words[i] = finalWord
      correctionsMade++
    }
  }

  setText(words.join(''))
  setCorrections(prev => prev + correctionsMade)
  setIsProcessing(false)
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Animated Matrix-style background */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 animate-pulse"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(156,146,172,0.4) 1px, transparent 0)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-30 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Epic Header */}
        <div className="text-center space-y-6">
          {/* Professional Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-full text-sm font-bold shadow-2xl animate-pulse border-2 border-blue-400">
            <CheckCircle className="h-5 w-5 animate-pulse" />
            PROFESSIONAL GRADE
            <Edit3 className="h-5 w-5 animate-bounce" />
          </div>
          
          {/* Glitchy Title */}
          <div className="relative">
            <h1 className="text-8xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl filter blur-[0.5px] hover:blur-none transition-all duration-300">
              {glitchText}
            </h1>
            <div className="absolute inset-0 text-8xl font-black text-blue-500 opacity-20 animate-ping">
              WrongCorrect™
            </div>
          </div>
          
          {/* Epic Subtitle */}
          <div className="max-w-4xl mx-auto">
            <p className="text-2xl text-gray-300 font-bold leading-relaxed">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Advanced</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">Text Correction</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">System</span>
            </p>
            <p className="text-lg text-gray-400 mt-2 font-medium">
              Powered by AI to enhance your writing with intelligent corrections
            </p>
          </div>
          
          {/* Status Badges */}
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 px-6 py-2 text-base font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 backdrop-blur-sm">
              <Brain className="h-4 w-4 mr-2" />
              AI-Powered
            </Badge>
            <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0 px-6 py-2 text-base font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 backdrop-blur-sm">
              <Cpu className="h-4 w-4 mr-2" />
              Universal Language
            </Badge>
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-6 py-2 text-base font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 backdrop-blur-sm">
              <Target className="h-4 w-4 mr-2" />
              Smart Corrections
            </Badge>
          </div>
        </div>

        {/* Correction Counter */}
        <div className="flex justify-center">
          <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/50 shadow-2xl hover:shadow-green-500/25 transition-all duration-500 transform hover:scale-110 backdrop-blur-sm">
            <CardContent className="pt-8 pb-8 px-12 text-center">
              <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-4 animate-pulse">
                {corrections}
              </div>
              <div className="text-xl font-bold text-green-300 flex items-center justify-center gap-2">
                <CheckCircle className="h-6 w-6 animate-pulse" />
                WORDS CORRECTED
                <Edit3 className="h-6 w-6 animate-bounce" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <Card className="bg-gradient-to-br from-slate-800/80 to-purple-900/80 border-purple-500/50 shadow-2xl backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-4 text-2xl font-black">
              <Settings className="h-8 w-8 animate-spin" />
              CORRECTION CONTROL PANEL
              <Sparkles className="h-8 w-8 animate-pulse" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Switch
                  id="enable-corrections"
                  checked={isEnabled}
                  onCheckedChange={setIsEnabled}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500 scale-125"
                />
                <Label htmlFor="enable-corrections" className="text-2xl font-bold text-white">
                  Enable Smart Corrections {isEnabled ? "✅📝✅" : "⏸️💤⏸️"}
                </Label>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={forceCorrectText} 
                  disabled={!text.trim() || !isEnabled || isProcessing}
                  className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white rounded-full px-12 py-4 font-black text-xl shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-green-400"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      CORRECTING...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-6 w-6 mr-3 animate-bounce" />
                      CORRECT TEXT
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={loadSampleText} 
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold shadow-xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 px-6 py-4"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Load Sample
                </Button>
                
                <Button 
                  onClick={resetText} 
                  className="bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white font-bold shadow-xl hover:shadow-gray-500/50 transition-all duration-300 transform hover:scale-105 px-6 py-4"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Text Input Area */}
        <Card className="bg-gradient-to-br from-slate-800/90 to-gray-900/90 border-gray-500/50 shadow-2xl backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-black flex items-center gap-3">
              <Edit3 className="h-8 w-8 animate-pulse" />
              TEXT INPUT AREA
              <Brain className="h-8 w-8 animate-spin" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <Textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              placeholder="Enter your text here for intelligent correction... implementation, authentication, pharmaceutical, revolutionary, comprehensive, sophisticated, unprecedented, multidimensional, cybersecurity, biotechnology, quantum, convolutional, blockchain, aerospace, environmental... Our advanced AI will enhance your writing with smart corrections! ✨📝✨"
              className="min-h-[400px] text-xl font-mono border-4 border-purple-500/50 focus:border-green-500 rounded-2xl p-6 shadow-inner bg-slate-900/80 text-white placeholder-gray-400 resize-none transition-all duration-300 backdrop-blur-sm"
              disabled={!isEnabled}
            />
            <div className="mt-6 flex items-center justify-between">
              <div className="text-lg font-bold">
                {isEnabled ? (
                  <div className="flex items-center gap-3 text-green-400">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                    CORRECTION ENGINE READY
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-gray-500">
                    <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                    CORRECTION ENGINE OFFLINE
                  </div>
                )}
              </div>
              <div className="text-lg text-gray-300 font-bold bg-slate-800/50 px-4 py-2 rounded-full">
                {text.length} chars • {text.split(/\s+/).filter(word => word.length > 0).length} words
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Panel */}
        <Card className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border-blue-500/50 shadow-2xl backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 text-blue-100">
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-blue-400 flex items-center gap-2">
                  <Brain className="h-6 w-6" />
                  SMART FEATURES
                </h3>
                <div className="space-y-3 text-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-2 animate-pulse"></div>
                    <p><strong>AI-Powered Corrections:</strong> Advanced machine learning algorithms</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 animate-pulse"></div>
                    <p><strong>Universal Support:</strong> Works with any English text</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mt-2 animate-pulse"></div>
                    <p><strong>Context Aware:</strong> Intelligent correction patterns</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-indigo-400 flex items-center gap-2">
                  <Target className="h-6 w-6" />
                  USE CASES
                </h3>
                <div className="space-y-3 text-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mt-2 animate-pulse"></div>
                    <p><strong>Professional Writing:</strong> Business documents and reports</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-cyan-500 rounded-full mt-2 animate-pulse"></div>
                    <p><strong>Academic Papers:</strong> Research and scholarly writing</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-teal-500 rounded-full mt-2 animate-pulse"></div>
                    <p><strong>Technical Documentation:</strong> Manuals and specifications</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
