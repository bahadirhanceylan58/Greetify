import { templates } from '@/data/templates'
import { notFound } from 'next/navigation'
import GreetingEditor from '@/components/GreetingEditor'

export function generateStaticParams() {
  return templates.map((t) => ({ id: t.id }))
}

export default function CreatePage({ params }: { params: { id: string } }) {
  const template = templates.find((t) => t.id === params.id)
  if (!template) notFound()

  return <GreetingEditor template={template} />
}
