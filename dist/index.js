import { jsx as u, jsxs as R } from "react/jsx-runtime";
import { createContext as w, useContext as g, useState as _, useEffect as m, useCallback as h } from "react";
import { HashRouter as $, Routes as B, Route as M, useLocation as H } from "react-router-dom";
import { DynamoDBClient as K } from "@aws-sdk/client-dynamodb";
import { GetCommand as W, PutCommand as z, UpdateCommand as j, DynamoDBDocumentClient as J } from "@aws-sdk/lib-dynamodb";
import { CognitoIdentityClient as V } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool as q } from "@aws-sdk/credential-provider-cognito-identity";
import { LambdaClient as Q, InvokeCommand as X } from "@aws-sdk/client-lambda";
const D = w(void 0), Y = ({ appConfig: e, children: o }) => /* @__PURE__ */ u(D.Provider, { value: { appConfig: e }, children: o }), L = () => {
  const e = g(D);
  if (e === void 0)
    throw new Error(
      "useAppConfig can only be used in the scope of a AppConfigProvider"
    );
  const { appConfig: o } = e;
  return { appConfig: o };
}, E = {
  appConfig: void 0,
  user: {
    identityId: void 0,
    id: void 0,
    name: void 0,
    email: void 0,
    groups: void 0,
    idToken: void 0,
    accessToken: void 0
  },
  refreshToken: void 0,
  awsConfig: void 0,
  awsCredentials: void 0
}, Z = (e) => sessionStorage.getItem(e), I = (e, o) => {
  e ? sessionStorage.setItem(o, e) : sessionStorage.removeItem(o);
}, ee = {
  awsCredentials: void 0,
  user: {
    identityId: void 0,
    id: void 0,
    name: void 0,
    email: void 0,
    groups: void 0,
    idToken: void 0,
    accessToken: void 0
  },
  awsConfig: void 0
}, T = {
  ...ee,
  refreshToken: void 0
}, oe = (e, o, t, r, s, n) => {
  const i = t && JSON.parse(atob(t.split(".")[1])), c = {
    identityId: o,
    id: i == null ? void 0 : i.sub,
    name: i ? i.name : s.LOGGED_OUT_USER,
    email: i == null ? void 0 : i.email,
    groups: i == null ? void 0 : i["cognito:groups"],
    idToken: t,
    accessToken: r
  };
  return {
    awsCredentials: e,
    user: c,
    awsConfig: e ? { region: n, credentials: e } : void 0
  };
}, U = (e, o, t) => {
  const { appIdentityPoolId: r, appRegion: s, appUserPoolId: n, appMessages: i } = e, c = q({
    client: new V({
      region: s
    }),
    identityPoolId: r,
    ...o && { logins: { [n]: o } }
  });
  return new Promise((a, d) => {
    c().then((l) => {
      a(
        oe(
          c,
          l.identityId,
          o,
          t,
          i,
          s
        )
      );
    }).catch((l) => {
      d(l);
    });
  });
}, y = (e, o) => {
  const { appAuthUrl: t, appClientId: r, appMessages: s } = e;
  return new Promise((n, i) => {
    o ? fetch(t, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=refresh_token&client_id=${r}&refresh_token=${o}`
    }).then((c) => {
      c.json().then((a) => {
        U(
          e,
          a.id_token,
          a.access_token
        ).then((d) => {
          n(d);
        }).catch((d) => {
          console.error(
            s.LOG_COULD_NOT_LOGIN_WITH_REFRESHED_TOKENS,
            d
          ), i(d);
        });
      }).catch((a) => {
        console.error(
          s.LOG_COULD_NOT_DECODE_AUTHENTICATION_RESPONSE,
          a
        ), i(a);
      });
    }).catch((c) => {
      console.error(s.LOG_COULD_NOT_GET_REFRESHED_TOKENS, c), i(c);
    }) : (console.warn(s.LOG_NO_REFRESH_TOKEN_AVAILABLE), i(Error(s.LOG_NO_REFRESH_TOKEN_AVAILABLE)));
  });
}, ne = (e, o) => {
  const { appAuthUrl: t, appClientId: r, appAuthRedirect: s, appMessages: n } = e;
  return new Promise((i, c) => {
    fetch(t, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=authorization_code&client_id=${r}&code=${o}&redirect_uri=${s}`
    }).then((a) => {
      a.json().then((d) => {
        y(e, d.refresh_token).then((l) => {
          i({
            ...l,
            refreshToken: d.refresh_token
          });
        }).catch((l) => {
          console.error(
            n.LOG_COULD_NOT_LOGIN_WITH_REFRESHED_TOKENS,
            l
          ), c(l);
        });
      }).catch((d) => {
        console.error(
          n.LOG_COULD_NOT_DECODE_AUTHENTICATION_RESPONSE,
          d
        ), c(d);
      });
    }).catch((a) => {
      console.error(n.LOG_COULD_NOT_GET_IDENTIFICATION_TOKENS, a), c(a);
    });
  });
}, te = (e, o) => new Promise((t, r) => {
  I(
    void 0,
    o.appRefreshTokenStorageKey
  ), e((s) => T), t();
}), se = (e, o) => {
  const t = Z(
    o.appRefreshTokenStorageKey
  );
  t && k(e, o, t);
}, re = (e, o, t, r) => {
  U(o, t, r).then((s) => {
    e((n) => ({ ...n, stateUpdate: s }));
  }).catch(() => {
    e((s) => T);
  });
}, k = (e, o, t) => new Promise((r, s) => {
  y(o, t).then((n) => {
    e((i) => ({ ...i, ...n })), r();
  }).catch((n) => {
    e((i) => T), s(n);
  });
}), ie = (e, o, t) => new Promise((r, s) => {
  ne(o, t).then((n) => {
    const { refreshToken: i } = n;
    I(
      i,
      o.appRefreshTokenStorageKey
    ), e((c) => n), r();
  }).catch((n) => {
    I(
      void 0,
      o.appRefreshTokenStorageKey
    ), e((c) => T), s(n);
  });
}), ce = {
  user: E.user,
  awsConfig: E.awsConfig,
  awsCredentials: E.awsCredentials,
  loginAnonymously: () => {
  },
  loginWithAuthorizationCode: () => Promise.reject(),
  logoff: () => Promise.reject()
}, b = w(ce), ae = (e, o) => {
  m(() => {
    const t = setInterval(e, o);
    return () => clearInterval(t);
  }, [e, o]);
}, de = 25 * 6e4, ue = ({ children: e }) => {
  const { appConfig: o } = L(), { appMessages: t } = o, [r, s] = _(E);
  m(() => {
    se(s, o);
  }, [o]);
  const n = h(
    () => te(s, o),
    [o]
  ), i = h(
    (p, C) => re(
      s,
      o,
      p,
      C
    ),
    [o]
  ), c = h(
    () => k(
      s,
      o,
      r.refreshToken
    ),
    [o, r.refreshToken]
  ), a = h(() => {
    c().catch(() => {
      console.warn(t.LOG_COULD_NOT_REFRESH_TOKENS);
    });
  }, [c, t]);
  ae(a, de);
  const d = h(
    () => i(void 0, void 0),
    [i]
  ), l = h(
    (p) => ie(s, o, p),
    [o]
  );
  return m(() => {
    r.awsCredentials || c().catch(() => {
      console.warn(t.LOG_COULD_NOT_REFRESH_TOKENS);
    });
  }, [r.awsCredentials, c, t]), /* @__PURE__ */ u(
    b.Provider,
    {
      value: {
        user: r.user,
        awsConfig: r.awsConfig,
        awsCredentials: r.awsCredentials,
        loginAnonymously: d,
        loginWithAuthorizationCode: l,
        logoff: n
      },
      children: e
    }
  );
}, A = () => {
  const {
    user: e,
    awsConfig: o,
    awsCredentials: t,
    loginAnonymously: r,
    loginWithAuthorizationCode: s,
    logoff: n
  } = g(b);
  return {
    user: e,
    awsConfig: o,
    awsCredentials: t,
    loginAnonymously: r,
    loginWithAuthorizationCode: s,
    logoff: n
  };
}, G = w({
  documentDB: void 0
}), le = ({ children: e }) => {
  const { awsConfig: o, awsCredentials: t } = A(), [r, s] = _();
  return m(() => {
    if (o) {
      const n = new K(o);
      s(J.from(n));
    } else
      s(void 0);
  }, [o]), m(() => {
    t && s((n) => (n && (n.config.credentials = t), n));
  }, [t]), /* @__PURE__ */ u(G.Provider, { value: { documentDB: r }, children: e });
}, Pe = () => {
  const { documentDB: e } = g(G), o = h(
    (s) => e ? e.send(new W(s)).then((n) => n) : Promise.reject(),
    [e]
  ), t = h(
    (s) => e ? e.send(new z(s)) : Promise.reject(),
    [e]
  ), r = h(
    (s) => e ? e.send(new j(s)) : Promise.reject(),
    [e]
  );
  return e ? {
    documentDB: e,
    ddbGet: o,
    ddbPut: t,
    ddbUpdate: r
  } : {
    documentDB: void 0,
    ddbGet: void 0,
    ddbPut: void 0,
    ddbUpdate: void 0
  };
}, F = w({
  invokeLambda: void 0
}), he = ({ children: e }) => {
  const {
    user: { accessToken: o },
    awsConfig: t,
    awsCredentials: r
  } = A(), [s, n] = _();
  m(() => {
    n(t ? new Q(t) : void 0);
  }, [t]), m(() => {
    r && n((c) => (c && (c.config.credentials = r), c));
  }, [r]);
  const i = h(
    (c, a) => {
      if (s) {
        const d = new TextEncoder(), l = new TextDecoder(), p = {
          FunctionName: c,
          ClientContext: btoa(JSON.stringify({ custom: { accessToken: o } })),
          Payload: a ? d.encode(JSON.stringify(a)) : void 0
        }, C = new X(p);
        return new Promise((S, v) => {
          s.send(C).then((f) => {
            (!f.StatusCode || f.StatusCode !== 200 || !f.Payload) && v(f);
            const O = JSON.parse(l.decode(f.Payload));
            (!O || !O.statusCode || O.statusCode !== 200) && v(f), S(O.body);
          }).catch((f) => {
            v(f);
          });
        });
      }
      return Promise.reject("Lambda client is undefined");
    },
    [s, o]
  );
  return /* @__PURE__ */ u(
    F.Provider,
    {
      value: { invokeLambda: s ? i : void 0 },
      children: e
    }
  );
}, Ne = () => {
  const { invokeLambda: e } = g(F);
  return { invokeLambda: e };
}, P = w({
  message: "",
  showMessage: (e) => {
  },
  dismissMessage: () => {
  }
}), pe = ({ children: e }) => {
  const [o, t] = _([]), [r, s] = _();
  m(() => {
    o.length && !r && (s(o[0]), t((c) => c.slice(1)));
  }, [o, r]);
  const n = h((c) => {
    t((a) => [...a, c]);
  }, []), i = h(() => {
    s(void 0);
  }, []);
  return /* @__PURE__ */ u(P.Provider, { value: { message: r, showMessage: n, dismissMessage: i }, children: e });
}, x = () => {
  const { showMessage: e } = g(P);
  return { showMessage: e };
}, Re = () => {
  const { message: e, dismissMessage: o } = g(P);
  return { message: e, dismissMessage: o };
}, N = w({
  showSpinner: () => {
  },
  dismissSpinner: () => {
  },
  showing: !1
}), me = ({ children: e }) => {
  const [o, t] = _(0), r = h(() => {
    t((i) => i + 1);
  }, []), s = h(() => {
    t((i) => i - 1);
  }, []), n = o > 0;
  return /* @__PURE__ */ u(N.Provider, { value: { showSpinner: r, dismissSpinner: s, showing: n }, children: e });
}, fe = () => {
  const { showSpinner: e, dismissSpinner: o } = g(N);
  return { showSpinner: e, dismissSpinner: o };
}, De = () => {
  const { showing: e } = g(N);
  return { showing: e };
}, ge = ({
  appConfig: e,
  children: o
}) => /* @__PURE__ */ u(pe, { children: /* @__PURE__ */ u(me, { children: /* @__PURE__ */ u(Y, { appConfig: e, children: /* @__PURE__ */ u(ue, { children: /* @__PURE__ */ u(le, { children: /* @__PURE__ */ u(he, { children: o }) }) }) }) }) }), Ce = (e, o, t, r, s, n) => {
  if (window.location.pathname === e) {
    const i = new URLSearchParams(window.location.search);
    if (i.get("auth-redirect") !== null && i.get("code") !== null) {
      window.history.replaceState({}, "", window.location.pathname);
      const c = i.get("code");
      c && (o(), r(c).then(() => {
        n && s(n.LOGIN_SUCCESSFUL);
      }).catch(() => {
        n && s(n.LOGIN_FAILED);
      }).finally(() => {
        t();
      }));
    }
  }
}, _e = () => {
  const {
    appConfig: { appBasePath: e, appMessages: o }
  } = L(), { showMessage: t } = x(), { showSpinner: r, dismissSpinner: s } = fe(), { loginWithAuthorizationCode: n } = A();
  m(() => {
    Ce(
      e,
      r,
      s,
      n,
      t,
      o
    );
  }, [
    e,
    r,
    s,
    n,
    t,
    o
  ]);
}, we = () => (_e(), null), Ue = ({ appConfig: e, routes: o, children: t }) => /* @__PURE__ */ R(ge, { appConfig: e, children: [
  /* @__PURE__ */ u(we, {}),
  /* @__PURE__ */ R($, { children: [
    t,
    /* @__PURE__ */ u(B, { children: o.map((r) => /* @__PURE__ */ u(
      M,
      {
        path: r.path,
        element: /* @__PURE__ */ u(r.component, {})
      },
      `${r.name}-route`
    )) })
  ] })
] }), ye = ({
  appHost: e,
  appBasePath: o,
  appRegion: t,
  appUserPoolId: r,
  appUserPoolDomain: s,
  appClientId: n,
  appIdentityPoolId: i,
  appRefreshTokenStorageKey: c,
  appLogoUrl: a,
  appMessages: d,
  hideLogin: l
}) => {
  const p = `https://${s}.auth.${t}.amazoncognito.com`, C = `${e}${o}?auth-redirect`, S = `${p}/oauth2/token`, v = `${p}/login?client_id=${n}&response_type=code&scope=email+openid+profile&redirect_uri=${C}`;
  return {
    appBasePath: o,
    appRegion: t,
    appUserPoolId: r,
    appClientId: n,
    appIdentityPoolId: i,
    appAuthRedirect: C,
    appAuthUrl: S,
    appExternalLoginUrl: v,
    appRefreshTokenStorageKey: c,
    appLogoUrl: a,
    appMessages: d,
    hideLogin: l || !1
  };
}, ke = (e) => {
  const {
    appConfig: { appMessages: o, hideLogin: t, appExternalLoginUrl: r }
  } = L(), { showMessage: s } = x(), {
    user: { name: n },
    logoff: i
  } = A(), c = H(), a = () => {
    i().then(() => s(o.LOGOUT_SUCCESSFUL)).catch(() => s(o.LOGOUT_FAILED));
  }, d = e.find((S) => S.path === c.pathname);
  return {
    currentRouteLabel: d ? d.label : "",
    hideLoginButton: !!n || t,
    appExternalLoginUrl: r,
    hideAccountButton: !n || t,
    userName: n,
    logoffAndShowMessage: a
  };
}, be = (e) => {
  const {
    appConfig: { appLogoUrl: o }
  } = L(), {
    user: { groups: t }
  } = A(), r = (n) => n ? t ? n.some(
    (i) => t.includes(i)
  ) : !1 : !0, s = e.filter((n) => !n.hideFromMenu).filter((n) => r(n.authorizedGroups));
  return { appLogoUrl: o, menuRoutes: s };
};
export {
  Ue as BaseAppScope,
  ye as makeAppConfig,
  ke as useAppBarState,
  L as useAppConfig,
  be as useAppDrawerState,
  Pe as useDDB,
  Ne as useLambda,
  x as useMessage,
  Re as useMessageAreaState,
  fe as useSpinner,
  De as useSpinnerAreaState,
  A as useUser
};
//# sourceMappingURL=index.js.map
