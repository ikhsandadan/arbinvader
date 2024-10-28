import type { NextPage } from 'next';
import { usePathname } from 'next/navigation';

import Homepage from './Home/page';

const Home: NextPage = () => {
  const pathName = usePathname();
  return (
    <>
      {pathName === '/' && <Homepage />}
    </>
  );
};

export default Home;
