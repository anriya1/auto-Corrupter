"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Zap, Settings } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function WrongCorrect() {
  const [text, setText] = useState("")
  const [isEnabled, setIsEnabled] = useState(true)
  const [corrections, setCorrections] = useState(0)
  const [lastCorrection, setLastCorrection] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
    
    // Skip common short words that might be too obvious
    const skipWords = ['a', 'i', 'is', 'it', 'in', 'on', 'at', 'to', 'of', 'or', 'so', 'no', 'my', 'we', 'he', 'me', 'be']
    if (skipWords.includes(word.toLowerCase())) return false
    
    return true
  }

  const applyWrongCorrection = (inputText: string) => {
    if (!isEnabled) return inputText
    
    // Split into words while preserving spaces and punctuation
    const words = inputText.split(/(\s+|[^\w\s])/g)
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      
      if (shouldCorrectWord(word) && Math.random() < 0.25) { // 25% chance to "correct"
        const typo = getRandomTypo(word)
        const correctedWord = preserveCase(word, typo)
        words[i] = correctedWord
        setLastCorrection(`"${word}" → "${correctedWord}"`)
        setCorrections(prev => prev + 1)
      }
    }
    
    return words.join('')
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setText(newText) // Just set the text directly, no auto-correction
  }

  const resetText = () => {
    setText("")
    setCorrections(0)
    setLastCorrection("")
  }

  const sampleTexts = [
    "The quick brown fox jumps over the lazy dog and runs through the beautiful forest.",
    "I believe that artificial intelligence will revolutionize the way we communicate and work together.",
    "Programming requires patience, dedication, and continuous learning to master complex algorithms.",
    "The magnificent sunset painted the sky with brilliant colors of orange, purple, and gold."
  ]

  const loadSampleText = () => {
    const sample = sampleTexts[Math.floor(Math.random() * sampleTexts.length)]
    setText(sample) // Don't auto-correct sample text
  }

  const forceCorrectText = () => {
    if (!text.trim()) return

    // Split into words while preserving spaces and punctuation
    const words = text.split(/(\s+|[^\w\s])/g)
    let correctionsMade = 0

    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      
      if (shouldCorrectWord(word)) {
        const typo = getRandomTypo(word)
        const correctedWord = preserveCase(word, typo)
        words[i] = correctedWord
        correctionsMade++
        setLastCorrection(`"${word}" → "${correctedWord}"`)
      }
    }

    setText(words.join(''))
    setCorrections(prev => prev + correctionsMade)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            WrongCorrect™
          </h1>
          <p className="text-lg text-gray-600">
            The Universal Autotext Corrupter — Corrects ANY word… incorrectly.
          </p>
          <Badge variant="destructive" className="text-sm">
            Now Supports ALL English Words!
          </Badge>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-4">
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-red-600">{corrections}</div>
              <div className="text-sm text-gray-600">Corrections Made</div>
            </CardContent>
          </Card>
          {lastCorrection && (
            <Card className="text-center">
              <CardContent className="pt-4">
                <div className="text-sm font-mono text-orange-600">{lastCorrection}</div>
                <div className="text-xs text-gray-600">Last Correction</div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Universal Correction Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="enable-corrections"
                  checked={isEnabled}
                  onCheckedChange={setIsEnabled}
                />
                <Label htmlFor="enable-corrections">
                  Enable Universal WrongCorrect™ {isEnabled ? "🔥" : "😴"}
                </Label>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={forceCorrectText} 
                  className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-2 font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
                  disabled={!text.trim() || !isEnabled}
                >
                  ✨ Correct All Words
                </Button>
                <Button onClick={loadSampleText} variant="outline" size="sm">
                  <Zap className="h-4 w-4 mr-1" />
                  Load Sample
                </Button>
                <Button onClick={resetText} variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Text Area */}
        <Card>
          <CardHeader>
            <CardTitle>Type ANY English Words (and watch them get corrupted...)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              placeholder="Type anything here normally - click 'Correct All Words' to corrupt your text!"
              className="min-h-[300px] text-lg font-mono"
              disabled={!isEnabled}
            />
            <div className="mt-2 text-sm text-gray-500">
              {isEnabled ? (
                <>
                  <span className="text-green-500">●</span> Ready to corrupt text when you click "Correct All Words"
                </>
              ) : (
                <>
                  <span className="text-gray-400">●</span> WrongCorrect™ is disabled
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="text-sm text-yellow-800 space-y-2">
              <p><strong>Universal Correction:</strong> Now works with ANY English word using advanced typo generation algorithms!</p>
              <p><strong>Typo Types:</strong> Letter swaps, missing letters, extra letters, wrong keys, common endings, and more.</p>
              <p><strong>Smart Filtering:</strong> Skips very short words, numbers, and obvious targets to maintain believability.</p>
              <p><strong>Perfect for:</strong> Testing with any vocabulary - technical terms, long words, proper nouns, everything!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
