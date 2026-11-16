import UserProfileDetails from '@/components/UserProfileDetails';

type Props = {
  params: Promise<{ id: string }>;
};

const UserPage = async ({ params }: Props) => {
  const { id } = await params;

  return <UserProfileDetails id={Number(id)} />;
};

export default UserPage;