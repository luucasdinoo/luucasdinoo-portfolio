import { CornerDownLeft } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { social } from '../../config/site'
import { contactDelivery, sendContact } from '../../lib/sendContact'
import { Eyebrow } from '../ui/Eyebrow'

const maxLength = 500
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Status = 'idle' | 'sending' | 'sent' | 'opened' | 'error'

const statusTone: Record<Status, string> = {
  idle: 'text-ink-subtle',
  sending: 'text-accent-ink',
  sent: 'text-success',
  opened: 'text-accent-ink',
  error: 'text-danger',
}

export function ContactSection() {
  const { t } = useTranslation()
  const reducedMotion = useReducedMotion()
  const headerRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const ids = useId()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [emailError, setEmailError] = useState(false)
  const [messageError, setMessageError] = useState(false)

  // Header rises in with the scroll, same choreography as the About section.
  const { scrollYProgress } = useScroll({ target: headerRef, offset: ['start end', 'start 55%'] })
  const headerOpacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  const headerY = useTransform(scrollYProgress, [0, 1], [48, 0])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'sending') return
    // Bots fill every field, people never see this one.
    if (new FormData(event.currentTarget).get('_gotcha')) return

    const badEmail = !emailPattern.test(email.trim())
    const badMessage = message.trim().length === 0
    setEmailError(badEmail)
    setMessageError(badMessage)
    if (badEmail || badMessage) {
      event.currentTarget.querySelector<HTMLElement>(badEmail ? 'input[type="email"]' : 'textarea')?.focus()
      return
    }

    setStatus('sending')
    try {
      await sendContact({ email: email.trim(), message: message.trim(), subject: t('contact.subject') })
      if (contactDelivery === 'endpoint') {
        setStatus('sent')
        setMessage('')
      } else {
        setStatus('opened')
      }
    } catch {
      setStatus('error')
    }
  }

  // Enter sends, Shift+Enter breaks the line, as the placeholder promises.
  const onMessageKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      formRef.current?.requestSubmit()
    }
  }

  const emailErrorId = `${ids}-email-error`
  const messageErrorId = `${ids}-message-error`
  const noteId = `${ids}-note`

  return (
    <section id="contato" aria-labelledby="contact-title" className="flex min-h-dvh scroll-mt-28 flex-col justify-center px-4 py-16 sm:px-8 lg:px-28 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px]">
        <motion.header
          ref={headerRef}
          style={reducedMotion ? undefined : { opacity: headerOpacity, y: headerY }}
          className="mb-8 flex flex-col gap-3 lg:mb-12"
        >
          <Eyebrow>{t('contact.eyebrow')}</Eyebrow>
          <h2 id="contact-title" className="font-display text-[32px] leading-[1.1] font-bold tracking-[-0.02em] text-ink lg:text-[40px]">
            {t('contact.title')}
          </h2>
          <p className="max-w-[68ch] text-[18px] leading-7 text-ink-muted">{t('contact.lead')}</p>
        </motion.header>

        <motion.form
          ref={formRef}
          onSubmit={onSubmit}
          noValidate
          aria-describedby={noteId}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="terminal mx-auto max-w-[760px] overflow-hidden rounded-lg border border-accent/45 bg-surface-raised/90 font-mono backdrop-blur-sm"
        >
          <div className="flex items-center gap-4 border-b border-line px-4 py-3">
            <span aria-hidden className="flex gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-accent" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            </span>
            <p className="min-w-0 flex-1 truncate text-[12px] leading-4 text-ink-subtle">lucas@portfolio:~/{t('contact.path')}</p>
            <p aria-live="polite" className={`text-[12px] leading-4 font-semibold tracking-[0.12em] uppercase ${statusTone[status]}`}>
              {t(`contact.status.${status}`)}
            </p>
          </div>

          <div className="px-4 sm:px-5">
            <div className="flex items-center gap-2 border-b border-line py-4">
              <span aria-hidden className="text-accent">&gt;</span>
              <label htmlFor={`${ids}-email`} className="shrink-0 text-[15px] text-ink-muted">
                {t('contact.from')}
              </label>
              <input
                id={`${ids}-email`}
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (emailError) setEmailError(!emailPattern.test(event.target.value.trim()))
                }}
                aria-invalid={emailError}
                aria-describedby={emailError ? emailErrorId : undefined}
                placeholder={t('contact.emailPlaceholder')}
                className="terminal-field min-w-0 flex-1 bg-transparent text-[15px] leading-6 text-ink placeholder:text-ink-subtle"
              />
            </div>
            {emailError && (
              <p id={emailErrorId} className="pt-2 text-[12px] leading-4 text-danger">
                &gt; {t('contact.errors.email')}
              </p>
            )}

            <div className="flex gap-2 py-4">
              <span aria-hidden className="pt-px text-[15px] leading-6 text-accent">
                &gt;
              </span>
              <label htmlFor={`${ids}-message`} className="sr-only">
                {t('contact.messageLabel')}
              </label>
              <textarea
                id={`${ids}-message`}
                name="message"
                required
                rows={6}
                maxLength={maxLength}
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value)
                  if (messageError) setMessageError(event.target.value.trim().length === 0)
                }}
                onKeyDown={onMessageKeyDown}
                aria-invalid={messageError}
                aria-describedby={messageError ? messageErrorId : undefined}
                placeholder={t('contact.messagePlaceholder')}
                className="terminal-field min-h-36 flex-1 resize-none bg-transparent text-[15px] leading-6 text-ink placeholder:text-ink-subtle"
              />
            </div>
            {messageError && (
              <p id={messageErrorId} className="-mt-2 pb-3 text-[12px] leading-4 text-danger">
                &gt; {t('contact.errors.message')}
              </p>
            )}

            {/* Honeypot: hidden from people and assistive tech, tempting for bots. */}
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

            <div className="flex items-center justify-between gap-4 border-t border-line py-4">
              <p className="text-[12px] leading-4 text-ink-subtle">
                <span className={message.length >= maxLength ? 'text-accent-ink' : undefined}>{message.length}</span> / {maxLength}
              </p>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-accent px-4 text-[12px] leading-4 font-semibold tracking-[0.12em] text-accent-ink uppercase transition-[background-color,box-shadow] duration-150 ease-out hover:bg-accent-soft hover:shadow-glow disabled:cursor-wait disabled:opacity-60"
              >
                {'// '}
                {t('contact.send')}
                <CornerDownLeft aria-hidden size={14} strokeWidth={2} />
              </button>
            </div>

            {status === 'sent' && <p className="pb-2 text-[13px] leading-5 text-success">&gt; {t('contact.feedback.sent')}</p>}
            {status === 'opened' && <p className="pb-2 text-[13px] leading-5 text-accent-ink">&gt; {t('contact.feedback.opened')}</p>}
            {status === 'error' && (
              <p className="pb-2 text-[13px] leading-5 text-danger">
                &gt; {t('contact.feedback.error')}{' '}
                <a href={social.email} className="underline underline-offset-4">
                  {social.email.replace('mailto:', '')}
                </a>
              </p>
            )}

            <p id={noteId} className="pb-4 text-[11px] leading-4 text-ink-subtle">
              {'// '}
              {t(contactDelivery === 'endpoint' ? 'contact.note.endpoint' : 'contact.note.mailto')}
            </p>
          </div>
        </motion.form>

      </div>
    </section>
  )
}
