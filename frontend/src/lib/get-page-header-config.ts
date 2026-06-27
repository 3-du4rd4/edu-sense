type HeaderConfig = {
  title: string;
  showStartSessionButton?: boolean;
};

export function getPageHeaderConfig(pathname: string): HeaderConfig {
  if (pathname === "/") {
    return {
      title: "Dashboard",
      showStartSessionButton: true,
    };
  }

  if (pathname.startsWith("/sessions")) {
    return {
      title: "Sessão de Estudo",
    };
  }

  if (pathname.startsWith("/settings")) {
    return {
      title: "Configurações",
    };
  }

  return {
    title: "EduSense",
  };
}
