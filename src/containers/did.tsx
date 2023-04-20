// @typed v1
import React, { useState } from 'react'
import useCrudObjectApi from '../hooks/api/crudObject'
import { DidActionStates, DidPanelStates } from '../types/user'
import { DataListItemComponent, DidContainerComponent } from '../types/containers'

const DidContainer = ({
  Component,
  profile,
  className,
  updateData,
  reFetchData,
  listIndex
}: DidContainerComponent & DataListItemComponent): JSX.Element => {
  const [didActionState, setDidActionState] = useState<DidActionStates>('idle')
  const [showPanel, setShowPanel] = useState<DidPanelStates>('idle')
  const { putData } = useCrudObjectApi()

  const followToggle = async () => {
    if (didActionState === 'loading') return
    setDidActionState('loading')
    await putData('creator/follow/' + profile.id)
    if (reFetchData) {
      reFetchData().then(() => {
        setDidActionState('idle')
      })
    } else {
      setDidActionState('idle')
    }
  }

  return (
    <>
      {profile && (
        <Component
          className={className}
          profile={profile}
          didActionState={didActionState}
          setDidActionState={setDidActionState}
          showPanel={showPanel}
          setShowPanel={setShowPanel}
          followToggle={followToggle}
          updateData={updateData}
          reFetchData={reFetchData}
          listIndex={listIndex}
        />
      )}
    </>
  )
}
export default DidContainer
