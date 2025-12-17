'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'

interface CustomDescriptorsContextType {
  customDescriptors: string[]
  addCustomDescriptor: (descriptor: string) => void
  removeCustomDescriptor: (descriptor: string) => void
}

const CustomDescriptorsContext = createContext<CustomDescriptorsContextType | undefined>(undefined)

export function CustomDescriptorsProvider({ children }: { children: ReactNode }) {
  const [customDescriptors, setCustomDescriptors] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Carregar descritores do localStorage ao montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem('customDescriptors')
      if (saved) {
        setCustomDescriptors(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Erro ao carregar descritores customizados:', error)
    }
    setIsLoaded(true)
  }, [])

  // Salvar descritores no localStorage quando mudam
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('customDescriptors', JSON.stringify(customDescriptors))
      } catch (error) {
        console.error('Erro ao salvar descritores customizados:', error)
      }
    }
  }, [customDescriptors, isLoaded])

  const addCustomDescriptor = useCallback((descriptor: string) => {
    const trimmed = descriptor.trim().toLowerCase()
    if (trimmed && !customDescriptors.includes(trimmed)) {
      setCustomDescriptors(prev => [...prev, trimmed])
    }
  }, [customDescriptors])

  const removeCustomDescriptor = useCallback((descriptor: string) => {
    setCustomDescriptors(prev => prev.filter(d => d !== descriptor))
  }, [])

  return (
    <CustomDescriptorsContext.Provider value={{ customDescriptors, addCustomDescriptor, removeCustomDescriptor }}>
      {children}
    </CustomDescriptorsContext.Provider>
  )
}

export function useCustomDescriptors() {
  const context = useContext(CustomDescriptorsContext)
  if (context === undefined) {
    throw new Error('useCustomDescriptors deve ser usado dentro de CustomDescriptorsProvider')
  }
  return context
}
