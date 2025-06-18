'use client'

import { PlatformLayout } from '@/components/layout/PlatformLayout'

export default function PlatformsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PlatformLayout>{children}</PlatformLayout>
}
