import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import { Profile } from '../types/user'
import { useDispatch, useSelector } from 'react-redux'
import { getUser, getUserAsync, getUserProfile } from '../store/user'
import { Sidebar } from '../components/sidebar'
import UploadSingle from '../components/form/uploadSingle'
import Title from '../components/common/title'
import Input from '../components/form/input'
import Dropdown from '../components/form/dropdown'
import Switch from '../components/form/switch'
import Label from '../components/form/label'
import Slider from '../components/form/slider'
import { Tooltip } from '../components/toolTip/toolTip'
import { collectionCategories } from '../constants/content'
import { domain } from '../constants/domain'
import Button from '../components/form/button'
import useCrudObjectApi from '../hooks/api/crudObject'
import Loader from '../components/common/loader'
import { integrations } from '../constants/config'

const EditProfilePage = (): JSX.Element => {
  const dispatch = useDispatch()
  const profile = useSelector(getUserProfile)
  const user = useSelector(getUser)
  const { postData, putData, dataLoading } = useCrudObjectApi()
  const categories = collectionCategories
  const [formData, setFormData] = useState<Profile>(null)

  const saveForm = (data) => {
    setFormData({ ...formData, ...data })
  }

  const saveProfile = () => {
    const response = formData?.id
      ? putData(`creator/${formData.id}`, formData)
      : postData(`creator`, formData)
    response.then(() => {
      dispatch(getUserAsync())
    })
  }

  const removeIntegration = (id: string) => {
    if (dataLoading) return
    const response = putData(`provider/remove/${id}`)
    response.then(() => {
      dispatch(getUserAsync())
    })
  }

  useEffect(() => {
    if (!formData?.id && profile) {
      saveForm(profile)
    }
  })

  return (
    <section className="flex dark:bg-madBlack bg-madWhite">
      <Sidebar
        profile={profile}
        backButton={true}
        showProfileLinks={true}
        showProfileHeader={true}
      />
      <div className="flex w-full min-h-screen lg:px-6 py-6">
        <div className="container min-w-full items-center">
          <Title title={formData?.id ? 'Manage' : 'Create'} subTitle="Profile" className="mb-6" />
          <div className="flex gap-2 flex-col md:flex-row mb-2">
            <div className="md:w-[300px] dark:bg-madOnyx bg-zinc-200 rounded-xl p-4 flex flex-col gap-2">
              <label className="-mb-3">Avatar</label>
              <UploadSingle
                className="p-b-square w-full block border border-gray-700 border-dashed rounded-sm mt-3"
                image={formData?.img_avatar}
                saveFile={(a) => saveForm({ img_avatar: a })}
                deleteFile={() => saveForm({ img_avatar: null })}
              />
              <label className="-mb-3">Banner</label>
              <UploadSingle
                className="h-32 w-full block border border-gray-700 border-dashed rounded-sm mt-3"
                image={formData?.img_banner}
                saveFile={(a) => saveForm({ img_banner: a })}
                deleteFile={() => saveForm({ img_banner: null })}
              />
            </div>
            <div className="md:w-1/2 dark:bg-madOnyx bg-zinc-200 rounded-xl p-4 flex flex-col gap-2">
              <Input
                label="Name"
                name="name"
                type="text"
                placeholder="Name..."
                value={formData?.name || ''}
                onChange={(value) => saveForm({ name: value })}
              />
              <Input
                label="Username"
                name="username"
                type="text"
                required={true}
                placeholder="Username..."
                value={formData?.username || ''}
                onChange={(value) => saveForm({ username: value })}
                tooltip={
                  <Tooltip button={<Icon icon="fa6-solid:question-circle" className="ml-2" />}>
                    Set your unique public user name. Letters numbers and full stop characters only.
                  </Tooltip>
                }
                tooltipPlacement={'bottom'}
              />
              <Dropdown
                label="Display name"
                name="display_name"
                placeholder="Select display name"
                value={formData?.display_name}
                required={true}
                nullable={false}
                onChange={(obj) => {
                  saveForm({ display_name: obj.id })
                }}
                selectOptions={[
                  { id: 'username', name: 'Username' },
                  { id: 'name', name: 'Name' }
                ]}
                tooltip={
                  <Tooltip button={<Icon icon="fa6-solid:question-circle" className="ml-2" />}>
                    Choose to display your Name or Username on your public profile.
                  </Tooltip>
                }
              />
              <Input
                required={true}
                label="Public profile url"
                name="uri"
                type="text"
                placeholder="uri..."
                value={formData?.uri || ''}
                onChange={(value) => saveForm({ uri: value })}
                tooltip={
                  <Tooltip button={<Icon icon="fa6-solid:question-circle" className="ml-2" />}>
                    Set your unique public profile URI, we recommend matching your username as close
                    as possible. Letters, numbers and dots only e.g <strong>mad.nfts.io</strong>
                  </Tooltip>
                }
              />
              <p className="text-madGray text-sm -mt-1.5">
                Example: https://madnfts.io/creator/
                <span className="text-madPink">{formData?.uri}</span>
              </p>
              <Dropdown
                label="Category"
                name="category"
                placeholder="Select category"
                value={formData?.category}
                required={true}
                nullable={false}
                onChange={(obj) => {
                  saveForm({ category: obj.id })
                }}
                selectOptions={categories}
                tooltip={
                  <Tooltip button={<Icon icon="fa6-solid:question-circle" className="ml-2" />}>
                    Select your default profile category. This will be displayed as your main cretor
                    category alongside other categories you have published collections in.
                  </Tooltip>
                }
              />
              <Input
                label="Biography"
                name="bio"
                type="textarea"
                placeholder="Bio..."
                max={2000}
                value={formData?.bio || ''}
                onChange={(value) => saveForm({ bio: value })}
              />
            </div>
            <div className="md:w-4/12 flex flex-col p-4 dark:bg-madOnyx bg-zinc-200 rounded-lg">
              <Label
                name="null"
                label="Connected"
                subLabel="Accounts"
                className="mb-3 block font-bold text-2xl"
              />
              <p className="text-sm mb-4">
                Connect your social and network accounts to display your social links on your
                profile. Give your followers confidence in your MADNFTs creator profile by
                connecting multiple accounts.
              </p>
              {integrations.map((item) => {
                if (!item.enabled) return
                const connected = user.integrations.find((a) => a.provider === item.id)
                return (
                  <div key={item.id} className="bg-gray-100 dark:bg-madBlack p-4 rounded-md mt-2">
                    {connected ? (
                      <div className="justify-center flex items-center justify-between">
                        <span>
                          <Icon icon={`simple-icons:${item.id}`} className="mr-2 text-sm" />
                          {item.id}
                        </span>
                        <span className="flex items-center gap-2">
                          {connected.uri ? (
                            <Tooltip
                              button={
                                <Icon
                                  icon={`fa6-solid:circle-check`}
                                  className="ml-2 text-sm text-madGreen"
                                />
                              }
                            >
                              Connected
                            </Tooltip>
                          ) : (
                            <Tooltip
                              button={
                                <Icon
                                  icon={`fa6-solid:circle-exclamation`}
                                  className="ml-2 text-sm text-madYellow"
                                />
                              }
                            >
                              Connected, but you do not have an accessible URL for your{' '}
                              {connected.provider} account
                            </Tooltip>
                          )}
                          <Button
                            onClick={() => removeIntegration(item.id)}
                            colour="madGray"
                            hoverColour="madBlack"
                            className="justify-center text-xs"
                          >
                            <>
                              Remove{' '}
                              {dataLoading && (
                                <Loader className="w-4 h-4 ml-2" imgClassName="w-4 h-4" />
                              )}
                            </>
                          </Button>
                        </span>
                      </div>
                    ) : (
                      <div className="justify-center flex items-center justify-between">
                        <span>
                          <Icon icon={`simple-icons:${item.id}`} className="mr-2 text-sm" />
                          {item.id}
                        </span>
                        <Button
                          href={domain.providerPrefix + item.oauthUri}
                          colour="madPink"
                          hoverColour="madBlack"
                          className="justify-center text-xs"
                        >
                          Connect
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex gap-2 flex-col md:flex-row">
            <div className="dark:bg-madOnyx bg-zinc-200 rounded-xl p-4 flex flex-col gap-2">
              <Switch
                preTitle="Register"
                title="Project"
                subTitle="Profile"
                value={!!formData?.project}
                onChange={(value) => saveForm({ project: value })}
                name="project"
                icon="fa6-solid:handshake"
              />
              <span className="text-sm">
                Register as a project and allow other creators to contribute to your account. Your
                profile will be listed as a project payout address to donate a percentage of creator
                royalties when creating collections.
              </span>
              {formData?.project ? (
                <div className="mt-2">
                  <Input
                    required={true}
                    label="Project Description"
                    name="project_description"
                    type="textarea"
                    placeholder="Please tell us how you would like to make a difference. This area is exclusively for projects that aim to support the communities they represent"
                    max={2000}
                    value={formData?.project_description || ''}
                    onChange={(value) => saveForm({ project_description: value })}
                  />
                </div>
              ) : null}
            </div>

            <div className="p-4 dark:bg-madOnyx bg-zinc-200 rounded-2xl w-full">
              <Label
                name="ambassador_percent"
                label="Ambassador"
                subLabel="Details"
                className="mb-3 block font-bold text-2xl"
              />
              <p className="text-sm mb-4">
                If you are an ambassador representing a creator, add your wallet payout address here
                to receive your ambassador royalties for sales associated with this creator profile.
              </p>
              <Input
                name="ambassador_address"
                placeholder={'0x00...'}
                value={formData?.ambassador_address || ''}
                onChange={(value) => {
                  saveForm({ ambassador_address: value })
                }}
              />
              <Slider
                value={formData?.ambassador_percent ?? 0}
                min={0}
                max={20}
                step={1}
                name="ambassador_percent"
                onChange={(value) => {
                  saveForm({ ambassador_percent: value })
                }}
              />
            </div>
          </div>

          <div className="flex mt-5 mr-0 md:justify-end">
            <Button colour="madPink" hoverColour="madBlack" onClick={saveProfile}>
              <Icon icon="fa-solid:save" className="text-sm mr-2" />
              <>Save profile</>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EditProfilePage
