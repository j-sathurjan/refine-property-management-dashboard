import { useGetIdentity, useOne } from "@refinedev/core"
import { Profile } from "../components"
import { User } from "../components/common/datas";

const MyProfile = () => {
  const {data:userData} = useGetIdentity();
  const user = userData as User
  const {data, isLoading, isError} = useOne({
    resource:'users',
    id:user?.userid,
  });
  const myProfile = data?.data ?? [];
  if(isLoading) return <div>Loading...</div>
  if(isError)return <div>Error</div>

  return (
    <Profile
      type='My'
      name={myProfile.name}
      email={myProfile.email}
      avatar={myProfile.avatar}
      properties={myProfile.allProperties}
    />
  )
}

export default MyProfile