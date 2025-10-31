import React, { useState } from 'react'
import styles from './AuthScreen.module.css'
import { Text } from '@packages/ui/components/Text'
import { apiClient } from '@api/client'

type Props = {
  onAuthenticated: () => void
}

export const AuthScreen: React.FC<Props> = ({ onAuthenticated }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleBack = () => {
    window.location.hash = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // simple validation
    const emailOk = /.+@.+\..+/.test(email)
    if (!emailOk) {
      setError('Введите корректный email')
      return
    }
    if (password.length < 6) {
      setError('Пароль должен быть не короче 6 символов')
      return
    }

    setIsSubmitting(true)
    try {
      // try login, if fails with message about credentials — attempt register
      const loginRes = await apiClient.request<{ accessToken: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      apiClient.setAccessToken(loginRes.accessToken)
      localStorage.setItem('hasRefresh', '1')
      onAuthenticated()
      return
    } catch (e) {
      // try register
      try {
        const regRes = await apiClient.request<{ accessToken: string }>('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        })
        apiClient.setAccessToken(regRes.accessToken)
        localStorage.setItem('hasRefresh', '1')
        onAuthenticated()
        return
      } catch (err) {
        setError('Неверные данные для входа')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.root}>
      <button className={styles.backButton} onClick={handleBack}>
        <Text variant="regularM">← Назад</Text>
      </button>
      <Text className={styles.title} variant="headingM">Войти или зарегистрироваться</Text>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <Text variant="regularM">Email</Text>
          <input className={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className={styles.field}>
          <Text variant="regularM">Пароль</Text>
          <input className={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
        </div>
        {error && <Text className={styles.error} variant="regularS">{error}</Text>}
        <button className={styles.button} type="submit" disabled={isSubmitting}>{isSubmitting ? 'Подождите…' : 'Войти'}</button>
        <Text className={styles.hint} variant="regularS">Если email не найден — мы создадим новый аккаунт автоматически</Text>
      </form>
    </div>
  )
}

