import { jsx as u, jsxs as R } from "react/jsx-runtime";
import { createContext as w, useContext as g, useState as _, useEffect as m, useCallback as h } from "react";
import { HashRouter as $, Routes as B, Route as M, useLocation as H } from "react-router-dom";
import { DynamoDBClient as K } from "@aws-sdk/client-dynamodb";
import { GetCommand as W, PutCommand as z, UpdateCommand as j, DynamoDBDocumentClient as J } from "@aws-sdk/lib-dynamodb";
import { CognitoIdentityClient as V } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool as q } from "@aws-sdk/credential-provider-cognito-identity";
import { LambdaClient as Q, InvokeCommand as X } from "@aws-sdk/client-lambda";
const y = w(void 0), Y = ({ appConfig: e, children: o }) => /* @__PURE__ */ u(y.Provider, { value: { appConfig: e }, children: o }), E = () => {
  const e = g(y);
  if (e === void 0)
    throw new Error(
      "useAppConfig can only be used in the scope of a AppConfigProvider"
    );
  const { appConfig: o } = e;
  return { appConfig: o };
}, T = {
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
}, Z = (e) => sessionStorage.getItem(e), P = (e, o) => {
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
}, L = {
  ...ee,
  refreshToken: void 0
}, oe = (e, o, t, i, s, n) => {
  const r = t && JSON.parse(atob(t.split(".")[1])), c = {
    identityId: o,
    id: r?.sub,
    name: r ? r.name : s.LOGGED_OUT_USER,
    email: r?.email,
    groups: r?.["cognito:groups"],
    idToken: t,
    accessToken: i
  };
  return {
    awsCredentials: e,
    user: c,
    awsConfig: e ? { region: n, credentials: e } : void 0
  };
}, D = (e, o, t) => {
  const { appIdentityPoolId: i, appRegion: s, appUserPoolId: n, appMessages: r } = e, c = q({
    client: new V({
      region: s
    }),
    identityPoolId: i,
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
          r,
          s
        )
      );
    }).catch((l) => {
      d(l);
    });
  });
}, k = (e, o) => {
  const { appAuthUrl: t, appClientId: i, appMessages: s } = e;
  return new Promise((n, r) => {
    o ? fetch(t, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=refresh_token&client_id=${i}&refresh_token=${o}`
    }).then((c) => {
      c.json().then((a) => {
        D(
          e,
          a.id_token,
          a.access_token
        ).then((d) => {
          n(d);
        }).catch((d) => {
          console.error(
            s.LOG_COULD_NOT_LOGIN_WITH_REFRESHED_TOKENS,
            d
          ), r(d);
        });
      }).catch((a) => {
        console.error(
          s.LOG_COULD_NOT_DECODE_AUTHENTICATION_RESPONSE,
          a
        ), r(a);
      });
    }).catch((c) => {
      console.error(s.LOG_COULD_NOT_GET_REFRESHED_TOKENS, c), r(c);
    }) : (console.warn(s.LOG_NO_REFRESH_TOKEN_AVAILABLE), r(Error(s.LOG_NO_REFRESH_TOKEN_AVAILABLE)));
  });
}, ne = (e, o) => {
  const { appAuthUrl: t, appClientId: i, appAuthRedirect: s, appMessages: n } = e;
  return new Promise((r, c) => {
    fetch(t, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=authorization_code&client_id=${i}&code=${o}&redirect_uri=${s}`
    }).then((a) => {
      a.json().then((d) => {
        k(e, d.refresh_token).then((l) => {
          r({
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
}, te = (e, o) => new Promise((t, i) => {
  P(
    void 0,
    o.appRefreshTokenStorageKey
  ), e((s) => L), t();
}), se = (e, o) => {
  const t = Z(
    o.appRefreshTokenStorageKey
  );
  t && U(e, o, t);
}, ie = (e, o, t, i) => {
  D(o, t, i).then((s) => {
    e((n) => ({ ...n, stateUpdate: s }));
  }).catch(() => {
    e((s) => L);
  });
}, U = (e, o, t) => new Promise((i, s) => {
  k(o, t).then((n) => {
    e((r) => ({ ...r, ...n })), i();
  }).catch((n) => {
    e((r) => L), s(n);
  });
}), re = (e, o, t) => new Promise((i, s) => {
  ne(o, t).then((n) => {
    const { refreshToken: r } = n;
    P(
      r,
      o.appRefreshTokenStorageKey
    ), e((c) => n), i();
  }).catch((n) => {
    P(
      void 0,
      o.appRefreshTokenStorageKey
    ), e((c) => L), s(n);
  });
}), ce = {
  user: T.user,
  awsConfig: T.awsConfig,
  awsCredentials: T.awsCredentials,
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
  const { appConfig: o } = E(), { appMessages: t } = o, [i, s] = _(T);
  m(() => {
    se(s, o);
  }, [o]);
  const n = h(
    () => te(s, o),
    [o]
  ), r = h(
    (p, C) => ie(
      s,
      o,
      p,
      C
    ),
    [o]
  ), c = h(
    () => U(
      s,
      o,
      i.refreshToken
    ),
    [o, i.refreshToken]
  ), a = h(() => {
    c().catch(() => {
      console.warn(t.LOG_COULD_NOT_REFRESH_TOKENS);
    });
  }, [c, t]);
  ae(a, de);
  const d = h(
    () => r(void 0, void 0),
    [r]
  ), l = h(
    (p) => re(s, o, p),
    [o]
  );
  return m(() => {
    i.awsCredentials || c().catch(() => {
      console.warn(t.LOG_COULD_NOT_REFRESH_TOKENS);
    });
  }, [i.awsCredentials, c, t]), /* @__PURE__ */ u(
    b.Provider,
    {
      value: {
        user: i.user,
        awsConfig: i.awsConfig,
        awsCredentials: i.awsCredentials,
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
    loginAnonymously: i,
    loginWithAuthorizationCode: s,
    logoff: n
  } = g(b);
  return {
    user: e,
    awsConfig: o,
    awsCredentials: t,
    loginAnonymously: i,
    loginWithAuthorizationCode: s,
    logoff: n
  };
}, G = w({
  documentDB: void 0
}), le = ({ children: e }) => {
  const { awsConfig: o, awsCredentials: t } = A(), [i, s] = _();
  return m(() => {
    if (o) {
      const n = new K(o);
      s(J.from(n));
    } else
      s(void 0);
  }, [o]), m(() => {
    t && s((n) => (n && (n.config.credentials = t), n));
  }, [t]), /* @__PURE__ */ u(G.Provider, { value: { documentDB: i }, children: e });
}, Ie = () => {
  const { documentDB: e } = g(G), o = h(
    (s) => e ? e.send(new W(s)).then((n) => n) : Promise.reject(),
    [e]
  ), t = h(
    (s) => e ? e.send(new z(s)) : Promise.reject(),
    [e]
  ), i = h(
    (s) => e ? e.send(new j(s)) : Promise.reject(),
    [e]
  );
  return e ? {
    documentDB: e,
    ddbGet: o,
    ddbPut: t,
    ddbUpdate: i
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
    awsCredentials: i
  } = A(), [s, n] = _();
  m(() => {
    n(t ? new Q(t) : void 0);
  }, [t]), m(() => {
    i && n((c) => (c && (c.config.credentials = i), c));
  }, [i]);
  const r = h(
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
      value: { invokeLambda: s ? r : void 0 },
      children: e
    }
  );
}, Ne = () => {
  const { invokeLambda: e } = g(F);
  return { invokeLambda: e };
}, I = w({
  message: "",
  showMessage: (e) => {
  },
  dismissMessage: () => {
  }
}), pe = ({ children: e }) => {
  const [o, t] = _([]), [i, s] = _();
  m(() => {
    o.length && !i && (s(o[0]), t((c) => c.slice(1)));
  }, [o, i]);
  const n = h((c) => {
    t((a) => [...a, c]);
  }, []), r = h(() => {
    s(void 0);
  }, []);
  return /* @__PURE__ */ u(I.Provider, { value: { message: i, showMessage: n, dismissMessage: r }, children: e });
}, x = () => {
  const { showMessage: e } = g(I);
  return { showMessage: e };
}, Re = () => {
  const { message: e, dismissMessage: o } = g(I);
  return { message: e, dismissMessage: o };
}, N = w({
  showSpinner: () => {
  },
  dismissSpinner: () => {
  },
  showing: !1
}), me = ({ children: e }) => {
  const [o, t] = _(0), i = h(() => {
    t((r) => r + 1);
  }, []), s = h(() => {
    t((r) => r - 1);
  }, []), n = o > 0;
  return /* @__PURE__ */ u(N.Provider, { value: { showSpinner: i, dismissSpinner: s, showing: n }, children: e });
}, fe = () => {
  const { showSpinner: e, dismissSpinner: o } = g(N);
  return { showSpinner: e, dismissSpinner: o };
}, ye = () => {
  const { showing: e } = g(N);
  return { showing: e };
}, ge = ({
  appConfig: e,
  children: o
}) => /* @__PURE__ */ u(pe, { children: /* @__PURE__ */ u(me, { children: /* @__PURE__ */ u(Y, { appConfig: e, children: /* @__PURE__ */ u(ue, { children: /* @__PURE__ */ u(le, { children: /* @__PURE__ */ u(he, { children: o }) }) }) }) }) }), Ce = (e, o, t, i, s, n) => {
  if (window.location.pathname === e) {
    const r = new URLSearchParams(window.location.search);
    if (r.get("auth-redirect") !== null && r.get("code") !== null) {
      window.history.replaceState({}, "", window.location.pathname);
      const c = r.get("code");
      c && (o(), i(c).then(() => {
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
  } = E(), { showMessage: t } = x(), { showSpinner: i, dismissSpinner: s } = fe(), { loginWithAuthorizationCode: n } = A();
  m(() => {
    Ce(
      e,
      i,
      s,
      n,
      t,
      o
    );
  }, [
    e,
    i,
    s,
    n,
    t,
    o
  ]);
}, we = () => (_e(), null), De = ({ appConfig: e, routes: o, children: t }) => /* @__PURE__ */ R(ge, { appConfig: e, children: [
  /* @__PURE__ */ u(we, {}),
  /* @__PURE__ */ R($, { children: [
    t,
    /* @__PURE__ */ u(B, { children: o.map((i) => /* @__PURE__ */ u(
      M,
      {
        path: i.path,
        element: /* @__PURE__ */ u(i.component, {})
      },
      `${i.name}-route`
    )) })
  ] })
] }), ke = ({
  appHost: e,
  appBasePath: o,
  appRegion: t,
  appUserPoolId: i,
  appUserPoolDomain: s,
  appClientId: n,
  appIdentityPoolId: r,
  appRefreshTokenStorageKey: c,
  appLogoUrl: a,
  appMessages: d,
  hideLogin: l
}) => {
  const p = `https://${s}.auth.${t}.amazoncognito.com`, C = `${e}${o}?auth-redirect`, S = `${p}/oauth2/token`, v = `${p}/login?client_id=${n}&response_type=code&scope=email+openid+profile&redirect_uri=${C}`;
  return {
    appBasePath: o,
    appRegion: t,
    appUserPoolId: i,
    appClientId: n,
    appIdentityPoolId: r,
    appAuthRedirect: C,
    appAuthUrl: S,
    appExternalLoginUrl: v,
    appRefreshTokenStorageKey: c,
    appLogoUrl: a,
    appMessages: d,
    hideLogin: l || !1
  };
}, Ue = (e) => {
  const {
    appConfig: { appMessages: o, hideLogin: t, appExternalLoginUrl: i }
  } = E(), { showMessage: s } = x(), {
    user: { name: n },
    logoff: r
  } = A(), c = H(), a = () => {
    r().then(() => s(o.LOGOUT_SUCCESSFUL)).catch(() => s(o.LOGOUT_FAILED));
  }, d = e.find((S) => S.path === c.pathname);
  return {
    currentRouteLabel: d ? d.label : "",
    hideLoginButton: !!n || t,
    appExternalLoginUrl: i,
    hideAccountButton: !n || t,
    userName: n,
    logoffAndShowMessage: a
  };
}, be = (e) => {
  const {
    appConfig: { appLogoUrl: o }
  } = E(), {
    user: { groups: t }
  } = A(), i = (n) => n ? t ? n.some(
    (r) => t.includes(r)
  ) : !1 : !0, s = e.filter((n) => !n.hideFromMenu).filter((n) => i(n.authorizedGroups));
  return { appLogoUrl: o, menuRoutes: s };
};
export {
  De as BaseAppScope,
  ke as makeAppConfig,
  Ue as useAppBarState,
  E as useAppConfig,
  be as useAppDrawerState,
  Ie as useDDB,
  Ne as useLambda,
  x as useMessage,
  Re as useMessageAreaState,
  fe as useSpinner,
  ye as useSpinnerAreaState,
  A as useUser
};
//# sourceMappingURL=index.js.map
