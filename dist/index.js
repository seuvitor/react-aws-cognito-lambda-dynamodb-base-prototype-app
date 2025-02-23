import { jsx as u, jsxs as N } from "react/jsx-runtime";
import { createContext as w, useContext as g, useState as _, useEffect as m, useCallback as h, useRef as $ } from "react";
import { HashRouter as M, Routes as B, Route as H, useLocation as K } from "react-router-dom";
import { DynamoDBClient as W } from "@aws-sdk/client-dynamodb";
import { GetCommand as z, PutCommand as j, UpdateCommand as J, DynamoDBDocumentClient as V } from "@aws-sdk/lib-dynamodb";
import { CognitoIdentityClient as q } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool as Q } from "@aws-sdk/credential-provider-cognito-identity";
import { LambdaClient as X, InvokeCommand as Y } from "@aws-sdk/client-lambda";
const D = w(void 0), Z = ({ appConfig: e, children: o }) => /* @__PURE__ */ u(D.Provider, { value: { appConfig: e }, children: o }), L = () => {
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
}, ee = (e) => sessionStorage.getItem(e), I = (e, o) => {
  e ? sessionStorage.setItem(o, e) : sessionStorage.removeItem(o);
}, oe = {
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
  ...oe,
  refreshToken: void 0
}, ne = (e, o, t, r, n, s) => {
  const i = t && JSON.parse(atob(t.split(".")[1])), c = {
    identityId: o,
    id: i == null ? void 0 : i.sub,
    name: i ? i.name : n.LOGGED_OUT_USER,
    email: i == null ? void 0 : i.email,
    groups: i == null ? void 0 : i["cognito:groups"],
    idToken: t,
    accessToken: r
  };
  return {
    awsCredentials: e,
    user: c,
    awsConfig: e ? { region: s, credentials: e } : void 0
  };
}, U = (e, o, t) => {
  const { appIdentityPoolId: r, appRegion: n, appUserPoolId: s, appMessages: i } = e, c = Q({
    client: new q({
      region: n
    }),
    identityPoolId: r,
    ...o && { logins: { [s]: o } }
  });
  return new Promise((a, d) => {
    c().then((l) => {
      a(
        ne(
          c,
          l.identityId,
          o,
          t,
          i,
          n
        )
      );
    }).catch((l) => {
      d(l);
    });
  });
}, y = (e, o) => {
  const { appAuthUrl: t, appClientId: r, appMessages: n } = e;
  return new Promise((s, i) => {
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
          s(d);
        }).catch((d) => {
          console.error(
            n.LOG_COULD_NOT_LOGIN_WITH_REFRESHED_TOKENS,
            d
          ), i(d);
        });
      }).catch((a) => {
        console.error(
          n.LOG_COULD_NOT_DECODE_AUTHENTICATION_RESPONSE,
          a
        ), i(a);
      });
    }).catch((c) => {
      console.error(n.LOG_COULD_NOT_GET_REFRESHED_TOKENS, c), i(c);
    }) : (console.warn(n.LOG_NO_REFRESH_TOKEN_AVAILABLE), i(Error(n.LOG_NO_REFRESH_TOKEN_AVAILABLE)));
  });
}, te = (e, o) => {
  const { appAuthUrl: t, appClientId: r, appAuthRedirect: n, appMessages: s } = e;
  return new Promise((i, c) => {
    fetch(t, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=authorization_code&client_id=${r}&code=${o}&redirect_uri=${n}`
    }).then((a) => {
      a.json().then((d) => {
        y(e, d.refresh_token).then((l) => {
          i({
            ...l,
            refreshToken: d.refresh_token
          });
        }).catch((l) => {
          console.error(
            s.LOG_COULD_NOT_LOGIN_WITH_REFRESHED_TOKENS,
            l
          ), c(l);
        });
      }).catch((d) => {
        console.error(
          s.LOG_COULD_NOT_DECODE_AUTHENTICATION_RESPONSE,
          d
        ), c(d);
      });
    }).catch((a) => {
      console.error(s.LOG_COULD_NOT_GET_IDENTIFICATION_TOKENS, a), c(a);
    });
  });
}, se = (e, o) => new Promise((t, r) => {
  I(
    void 0,
    o.appRefreshTokenStorageKey
  ), e((n) => T), t();
}), re = (e, o) => {
  const t = ee(
    o.appRefreshTokenStorageKey
  );
  t && k(e, o, t);
}, ie = (e, o, t, r) => {
  U(o, t, r).then((n) => {
    e((s) => ({ ...s, stateUpdate: n }));
  }).catch(() => {
    e((n) => T);
  });
}, k = (e, o, t) => new Promise((r, n) => {
  y(o, t).then((s) => {
    e((i) => ({ ...i, ...s })), r();
  }).catch((s) => {
    e((i) => T), n(s);
  });
}), ce = (e, o, t) => new Promise((r, n) => {
  te(o, t).then((s) => {
    const { refreshToken: i } = s;
    I(
      i,
      o.appRefreshTokenStorageKey
    ), e((c) => s), r();
  }).catch((s) => {
    I(
      void 0,
      o.appRefreshTokenStorageKey
    ), e((c) => T), n(s);
  });
}), ae = {
  user: E.user,
  awsConfig: E.awsConfig,
  awsCredentials: E.awsCredentials,
  loginAnonymously: () => {
  },
  loginWithAuthorizationCode: () => Promise.reject(),
  logoff: () => Promise.reject()
}, G = w(ae), de = (e, o) => {
  const t = $(), r = h(() => {
    const n = t.current;
    n && (t.current = void 0, clearInterval(n));
  }, []);
  return m(() => (t.current = setInterval(e, o), r), [e, o, r]), r;
}, ue = 25 * 6e4, le = ({ children: e }) => {
  const { appConfig: o } = L(), { appMessages: t } = o, [r, n] = _(E);
  m(() => {
    re(n, o);
  }, [o]);
  const s = h(
    () => se(n, o),
    [o]
  ), i = h(
    (p, C) => ie(
      n,
      o,
      p,
      C
    ),
    [o]
  ), c = h(
    () => k(
      n,
      o,
      r.refreshToken
    ),
    [o, r.refreshToken]
  ), a = h(() => {
    c().catch(() => {
      console.warn(t.LOG_COULD_NOT_REFRESH_TOKENS);
    });
  }, [c, t]);
  de(a, ue);
  const d = h(
    () => i(void 0, void 0),
    [i]
  ), l = h(
    (p) => ce(n, o, p),
    [o]
  );
  return m(() => {
    r.awsCredentials || c().catch(() => {
      console.warn(t.LOG_COULD_NOT_REFRESH_TOKENS);
    });
  }, [r.awsCredentials, c, t]), /* @__PURE__ */ u(
    G.Provider,
    {
      value: {
        user: r.user,
        awsConfig: r.awsConfig,
        awsCredentials: r.awsCredentials,
        loginAnonymously: d,
        loginWithAuthorizationCode: l,
        logoff: s
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
    loginWithAuthorizationCode: n,
    logoff: s
  } = g(G);
  return {
    user: e,
    awsConfig: o,
    awsCredentials: t,
    loginAnonymously: r,
    loginWithAuthorizationCode: n,
    logoff: s
  };
}, b = w({
  documentDB: void 0
}), he = ({ children: e }) => {
  const { awsConfig: o, awsCredentials: t } = A(), [r, n] = _();
  return m(() => {
    if (o) {
      const s = new W(o);
      n(V.from(s));
    } else
      n(void 0);
  }, [o]), m(() => {
    t && n((s) => (s && (s.config.credentials = t), s));
  }, [t]), /* @__PURE__ */ u(b.Provider, { value: { documentDB: r }, children: e });
}, Re = () => {
  const { documentDB: e } = g(b), o = h(
    (n) => e ? e.send(new z(n)) : Promise.reject(),
    [e]
  ), t = h(
    (n) => e ? e.send(new j(n)) : Promise.reject(),
    [e]
  ), r = h(
    (n) => e ? e.send(new J(n)) : Promise.reject(),
    [e]
  );
  return {
    documentDB: e,
    ddbGet: o,
    ddbPut: t,
    ddbUpdate: r
  };
}, x = w({
  invokeLambda: (e, o) => Promise.reject()
}), pe = ({ children: e }) => {
  const {
    user: { accessToken: o },
    awsConfig: t,
    awsCredentials: r
  } = A(), [n, s] = _();
  m(() => {
    s(t ? new X(t) : void 0);
  }, [t]), m(() => {
    r && s((c) => (c && (c.config.credentials = r), c));
  }, [r]);
  const i = h(
    (c, a) => {
      if (n) {
        const d = new TextEncoder(), l = new TextDecoder(), p = {
          FunctionName: c,
          ClientContext: btoa(JSON.stringify({ custom: { accessToken: o } })),
          Payload: a ? d.encode(JSON.stringify(a)) : void 0
        }, C = new Y(p);
        return new Promise((S, v) => {
          n.send(C).then((f) => {
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
    [n, o]
  );
  return /* @__PURE__ */ u(
    x.Provider,
    {
      value: {
        invokeLambda: n ? i : () => Promise.reject()
      },
      children: e
    }
  );
}, Ne = () => {
  const { invokeLambda: e } = g(x);
  return { invokeLambda: e };
}, P = w({
  message: "",
  showMessage: (e) => {
  },
  dismissMessage: () => {
  }
}), me = ({ children: e }) => {
  const [o, t] = _([]), [r, n] = _();
  m(() => {
    o.length && !r && (n(o[0]), t((c) => c.slice(1)));
  }, [o, r]);
  const s = h((c) => {
    t((a) => [...a, c]);
  }, []), i = h(() => {
    n(void 0);
  }, []);
  return /* @__PURE__ */ u(P.Provider, { value: { message: r, showMessage: s, dismissMessage: i }, children: e });
}, F = () => {
  const { showMessage: e } = g(P);
  return { showMessage: e };
}, De = () => {
  const { message: e, dismissMessage: o } = g(P);
  return { message: e, dismissMessage: o };
}, R = w({
  showSpinner: () => {
  },
  dismissSpinner: () => {
  },
  showing: !1
}), fe = ({ children: e }) => {
  const [o, t] = _(0), r = h(() => {
    t((i) => i + 1);
  }, []), n = h(() => {
    t((i) => i - 1);
  }, []), s = o > 0;
  return /* @__PURE__ */ u(R.Provider, { value: { showSpinner: r, dismissSpinner: n, showing: s }, children: e });
}, ge = () => {
  const { showSpinner: e, dismissSpinner: o } = g(R);
  return { showSpinner: e, dismissSpinner: o };
}, Ue = () => {
  const { showing: e } = g(R);
  return { showing: e };
}, Ce = ({
  appConfig: e,
  children: o
}) => /* @__PURE__ */ u(me, { children: /* @__PURE__ */ u(fe, { children: /* @__PURE__ */ u(Z, { appConfig: e, children: /* @__PURE__ */ u(le, { children: /* @__PURE__ */ u(he, { children: /* @__PURE__ */ u(pe, { children: o }) }) }) }) }) }), _e = (e, o, t, r, n, s) => {
  if (window.location.pathname === e) {
    const i = new URLSearchParams(window.location.search);
    if (i.get("auth-redirect") !== null && i.get("code") !== null) {
      window.history.replaceState({}, "", window.location.pathname);
      const c = i.get("code");
      c && (o(), r(c).then(() => {
        s && n(s.LOGIN_SUCCESSFUL);
      }).catch(() => {
        s && n(s.LOGIN_FAILED);
      }).finally(() => {
        t();
      }));
    }
  }
}, we = () => {
  const {
    appConfig: { appBasePath: e, appMessages: o }
  } = L(), { showMessage: t } = F(), { showSpinner: r, dismissSpinner: n } = ge(), { loginWithAuthorizationCode: s } = A();
  m(() => {
    _e(
      e,
      r,
      n,
      s,
      t,
      o
    );
  }, [
    e,
    r,
    n,
    s,
    t,
    o
  ]);
}, Se = () => (we(), null), ye = ({ appConfig: e, routes: o, children: t }) => /* @__PURE__ */ N(Ce, { appConfig: e, children: [
  /* @__PURE__ */ u(Se, {}),
  /* @__PURE__ */ N(M, { children: [
    t,
    /* @__PURE__ */ u(B, { children: o.map((r) => /* @__PURE__ */ u(
      H,
      {
        exact: !0,
        path: r.path,
        element: /* @__PURE__ */ u(r.component, {}),
        ...r.options
      },
      `${r.name}-route`
    )) })
  ] })
] }), ke = ({
  appHost: e,
  appBasePath: o,
  appRegion: t,
  appUserPoolId: r,
  appUserPoolDomain: n,
  appClientId: s,
  appIdentityPoolId: i,
  appRefreshTokenStorageKey: c,
  appLogoUrl: a,
  appMessages: d,
  hideLogin: l
}) => {
  const p = `https://${n}.auth.${t}.amazoncognito.com`, C = `${e}${o}?auth-redirect`, S = `${p}/oauth2/token`, v = `${p}/login?client_id=${s}&response_type=code&scope=email+openid+profile&redirect_uri=${C}`;
  return {
    appBasePath: o,
    appRegion: t,
    appUserPoolId: r,
    appClientId: s,
    appIdentityPoolId: i,
    appAuthRedirect: C,
    appAuthUrl: S,
    appExternalLoginUrl: v,
    appRefreshTokenStorageKey: c,
    appLogoUrl: a,
    appMessages: d,
    hideLogin: l || !1
  };
}, Ge = (e) => {
  const {
    appConfig: { appMessages: o, hideLogin: t, appExternalLoginUrl: r }
  } = L(), { showMessage: n } = F(), {
    user: { name: s },
    logoff: i
  } = A(), c = K(), a = () => {
    i().then(() => n(o.LOGOUT_SUCCESSFUL)).catch(() => n(o.LOGOUT_FAILED));
  }, d = e.find((S) => S.path === c.pathname);
  return {
    currentRouteLabel: d ? d.label : "",
    hideLoginButton: !!s || t,
    appExternalLoginUrl: r,
    hideAccountButton: !s || t,
    userName: s,
    logoffAndShowMessage: a
  };
}, be = (e) => {
  const {
    appConfig: { appLogoUrl: o }
  } = L(), {
    user: { groups: t }
  } = A(), r = (s) => s ? t ? s.some(
    (i) => t.includes(i)
  ) : !1 : !0, n = e.filter((s) => !s.hideFromMenu).filter((s) => r(s.authorizedGroups));
  return { appLogoUrl: o, menuRoutes: n };
};
export {
  ye as BaseAppScope,
  ke as makeAppConfig,
  Ge as useAppBarState,
  L as useAppConfig,
  be as useAppDrawerState,
  Re as useDDB,
  Ne as useLambda,
  F as useMessage,
  De as useMessageAreaState,
  ge as useSpinner,
  Ue as useSpinnerAreaState,
  A as useUser
};
//# sourceMappingURL=index.js.map
