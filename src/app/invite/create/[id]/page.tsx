import { invitationTemplates } from '@/data/invitationTemplates'
import InvitationEditor from '@/components/InvitationEditor'
import { notFound } from 'next/navigation'

interface Props {
  params: { id: string }
}

export default function InviteCreatePage({ params }: Props) {
  const template = invitationTemplates.find((t) => t.id === params.id)
  if (!template) notFound()
  return <InvitationEditor template={template} />
}

export function generateStaticParams() {
  return invitationTemplates.map((t) => ({ id: t.id }))
}
