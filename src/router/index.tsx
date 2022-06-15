import { Outlet, Link, useParams } from "react-router-dom";

function Layout() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/courses">Courses</Link>
          </li>
          <li>
            <Link to="/nothing-here">Nothing Here</Link>
          </li>
        </ul>
      </nav>

      <hr />

      <Outlet />
    </div>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function Courses() {
  return (
    <div>
      <h2>Courses</h2>
      <Outlet />
    </div>
  );
}

function CoursesIndex() {
  return (
    <div>
      <p>Please choose a course:</p>

      <nav>
        <ul>
          <li>
            <Link to="react-fundamentals">React Fundamentals</Link>
          </li>
          <li>
            <Link to="advanced-react">Advanced React</Link>
          </li>
          <li>
            <Link to="react-router">React Router</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

function Course() {
  let { id = '' } = useParams<"id">();

  return (
    <div>
      <h2>Welcome to the {id!.split("-").map(capitalizeString).join(" ")} course!</h2>

      <p>This is a great course. You're gonna love it!</p>

      <Link to="/courses">See all courses</Link>
    </div>
  );
}

function capitalizeString(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function NoMatch() {
  return (
    <div>
      <h2>It looks like you're lost...</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

export const components: Record<string, { component: JSX.Element; index?: JSX.Element }> = {
  "/": {
    component: <Layout />,
    index: <Home />,
  },
  "/courses": {
    component: <Courses />,
    index: <CoursesIndex />,
  },
  "/courses/:id": {
    component: <Course />,
  },
  "*": {
    component: <NoMatch />,
  },
};

type KEY = keyof typeof components;

export const generateRoutes = (router: Router[]) => {
  const result = router.map((route) => {
    const component = components[route.path as KEY];

    if (route.path) {
      if (component) {
        route.element = component.component;

        if (component.index) {
          if (route.children) {
            route.children.push({ index: true, element: component.index });
          } else {
            route.children = [{ index: true, element: component.index }];
          }
        }
      } else {
        console.warn(`[${route.path}] 缺少对应的组件`);
      }
    }

    if (route.children && route.children.length) {
      generateRoutes(route.children);
    }

    return route;
  });

  const filterInvalidRouter = (router: Router[]) => {
    return router.filter((item) => {
      if (item.children) item.children = filterInvalidRouter(item.children);

      if (item.element) {
        return true;
      } else {
        return false;
      }
    });
  };

  return filterInvalidRouter(result);
};
