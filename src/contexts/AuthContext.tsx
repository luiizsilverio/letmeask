import { useState, useEffect, createContext, ReactNode } from 'react'
import { auth, firebase } from '../services/firebase'

type User = {
  id: string
  name: string
  avatar: string
}

type AuthContextType = {
  user: User | undefined
  signInGoogle: () => Promise<void>
  signOutGoogle: () => void
}

type AuthProviderType = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider(props: AuthProviderType) {
  const [user, setUser] = useState<User>()

  async function signInGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider()

    const result = await auth.signInWithPopup(provider)
    
    if (result.user) {
      const { displayName, photoURL, uid } = result.user
      
      if (!displayName || !photoURL) {
        throw new Error('Missing information from Google account.')
      }

      setUser({ 
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }
  }

  async function signOutGoogle() {
    if (user?.id) {
      await auth.signOut()

      setUser({} as User)
    }    
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid } = user
        
        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google account.')
        }
  
        setUser({ 
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    })

    return () => unsubscribe(); // parar de ouvir o estado de autenticação
  }, [])

  return (
    <AuthContext.Provider value={{ user, signInGoogle, signOutGoogle }}>
      { props.children }
    </AuthContext.Provider>
  )
}