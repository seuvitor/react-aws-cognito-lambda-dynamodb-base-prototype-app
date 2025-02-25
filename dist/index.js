import { jsx as u, jsxs as R } from "react/jsx-runtime";
import { createContext as w, useContext as g, useState as _, useEffect as m, useCallback as h } from "react";
import { HashRouter as $, Routes as M, Route as B, useLocation as H } from "react-router-dom";
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
}, oe = (e, o, n, r, t, s) => {
  const i = n && JSON.parse(atob(n.split(".")[1])), c = {
    identityId: o,
    id: i == null ? void 0 : i.sub,
    name: i ? i.name : t.LOGGED_OUT_USER,
    email: i == null ? void 0 : i.email,
    groups: i == null ? void 0 : i["cognito:groups"],
    idToken: n,
    accessToken: r
  };
  return {
    awsCredentials: e,
    user: c,
    awsConfig: e ? { region: s, credentials: e } : void 0
  };
}, U = (e, o, n) => {
  const { appIdentityPoolId: r, appRegion: t, appUserPoolId: s, appMessages: i } = e, c = q({
    client: new V({
      region: t
    }),
    identityPoolId: r,
    ...o && { logins: { [s]: o } }
  });
  return new Promise((a, d) => {
    c().then((l) => {
      a(
        oe(
          c,
          l.identityId,
          o,
          n,
          i,
          t
        )
      );
    }).catch((l) => {
      d(l);
    });
  });
}, y = (e, o) => {
  const { appAuthUrl: n, appClientId: r, appMessages: t } = e;
  return new Promise((s, i) => {
    o ? fetch(n, {
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
            t.LOG_COULD_NOT_LOGIN_WITH_REFRESHED_TOKENS,
            d
          ), i(d);
        });
      }).catch((a) => {
        console.error(
          t.LOG_COULD_NOT_DECODE_AUTHENTICATION_RESPONSE,
          a
        ), i(a);
      });
    }).catch((c) => {
      console.error(t.LOG_COULD_NOT_GET_REFRESHED_TOKENS, c), i(c);
    }) : (console.warn(t.LOG_NO_REFRESH_TOKEN_AVAILABLE), i(Error(t.LOG_NO_REFRESH_TOKEN_AVAILABLE)));
  });
}, ne = (e, o) => {
  const { appAuthUrl: n, appClientId: r, appAuthRedirect: t, appMessages: s } = e;
  return new Promise((i, c) => {
    fetch(n, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=authorization_code&client_id=${r}&code=${o}&redirect_uri=${t}`
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
}, te = (e, o) => new Promise((n, r) => {
  I(
    void 0,
    o.appRefreshTokenStorageKey
  ), e((t) => T), n();
}), se = (e, o) => {
  const n = Z(
    o.appRefreshTokenStorageKey
  );
  n && k(e, o, n);
}, re = (e, o, n, r) => {
  U(o, n, r).then((t) => {
    e((s) => ({ ...s, stateUpdate: t }));
  }).catch(() => {
    e((t) => T);
  });
}, k = (e, o, n) => new Promise((r, t) => {
  y(o, n).then((s) => {
    e((i) => ({ ...i, ...s })), r();
  }).catch((s) => {
    e((i) => T), t(s);
  });
}), ie = (e, o, n) => new Promise((r, t) => {
  ne(o, n).then((s) => {
    const { refreshToken: i } = s;
    I(
      i,
      o.appRefreshTokenStorageKey
    ), e((c) => s), r();
  }).catch((s) => {
    I(
      void 0,
      o.appRefreshTokenStorageKey
    ), e((c) => T), t(s);
  });
}), ce = {
  user: E.user,
  awsConfig: E.awsConfig,
  awsCredentials: E.awsCredentials,
  loginAnonymously: () => {
  },
  loginWithAuthorizationCode: () => Promise.reject(),
  logoff: () => Promise.reject()
}, G = w(ce), ae = (e, o) => {
  m(() => {
    const n = setInterval(e, o);
    return () => clearInterval(n);
  }, [e, o]);
}, de = 25 * 6e4, ue = ({ children: e }) => {
  const { appConfig: o } = L(), { appMessages: n } = o, [r, t] = _(E);
  m(() => {
    se(t, o);
  }, [o]);
  const s = h(
    () => te(t, o),
    [o]
  ), i = h(
    (p, C) => re(
      t,
      o,
      p,
      C
    ),
    [o]
  ), c = h(
    () => k(
      t,
      o,
      r.refreshToken
    ),
    [o, r.refreshToken]
  ), a = h(() => {
    c().catch(() => {
      console.warn(n.LOG_COULD_NOT_REFRESH_TOKENS);
    });
  }, [c, n]);
  ae(a, de);
  const d = h(
    () => i(void 0, void 0),
    [i]
  ), l = h(
    (p) => ie(t, o, p),
    [o]
  );
  return m(() => {
    r.awsCredentials || c().catch(() => {
      console.warn(n.LOG_COULD_NOT_REFRESH_TOKENS);
    });
  }, [r.awsCredentials, c, n]), /* @__PURE__ */ u(
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
    awsCredentials: n,
    loginAnonymously: r,
    loginWithAuthorizationCode: t,
    logoff: s
  } = g(G);
  return {
    user: e,
    awsConfig: o,
    awsCredentials: n,
    loginAnonymously: r,
    loginWithAuthorizationCode: t,
    logoff: s
  };
}, b = w({
  documentDB: void 0
}), le = ({ children: e }) => {
  const { awsConfig: o, awsCredentials: n } = A(), [r, t] = _();
  return m(() => {
    if (o) {
      const s = new K(o);
      t(J.from(s));
    } else
      t(void 0);
  }, [o]), m(() => {
    n && t((s) => (s && (s.config.credentials = n), s));
  }, [n]), /* @__PURE__ */ u(b.Provider, { value: { documentDB: r }, children: e });
}, Pe = () => {
  const { documentDB: e } = g(b), o = h(
    (t) => e ? e.send(new W(t)) : Promise.reject(),
    [e]
  ), n = h(
    (t) => e ? e.send(new z(t)) : Promise.reject(),
    [e]
  ), r = h(
    (t) => e ? e.send(new j(t)) : Promise.reject(),
    [e]
  );
  return {
    documentDB: e,
    ddbGet: o,
    ddbPut: n,
    ddbUpdate: r
  };
}, F = w({
  invokeLambda: (e, o) => Promise.reject()
}), he = ({ children: e }) => {
  const {
    user: { accessToken: o },
    awsConfig: n,
    awsCredentials: r
  } = A(), [t, s] = _();
  m(() => {
    s(n ? new Q(n) : void 0);
  }, [n]), m(() => {
    r && s((c) => (c && (c.config.credentials = r), c));
  }, [r]);
  const i = h(
    (c, a) => {
      if (t) {
        const d = new TextEncoder(), l = new TextDecoder(), p = {
          FunctionName: c,
          ClientContext: btoa(JSON.stringify({ custom: { accessToken: o } })),
          Payload: a ? d.encode(JSON.stringify(a)) : void 0
        }, C = new X(p);
        return new Promise((S, v) => {
          t.send(C).then((f) => {
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
    [t, o]
  );
  return /* @__PURE__ */ u(
    F.Provider,
    {
      value: {
        invokeLambda: t ? i : () => Promise.reject()
      },
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
  const [o, n] = _([]), [r, t] = _();
  m(() => {
    o.length && !r && (t(o[0]), n((c) => c.slice(1)));
  }, [o, r]);
  const s = h((c) => {
    n((a) => [...a, c]);
  }, []), i = h(() => {
    t(void 0);
  }, []);
  return /* @__PURE__ */ u(P.Provider, { value: { message: r, showMessage: s, dismissMessage: i }, children: e });
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
  const [o, n] = _(0), r = h(() => {
    n((i) => i + 1);
  }, []), t = h(() => {
    n((i) => i - 1);
  }, []), s = o > 0;
  return /* @__PURE__ */ u(N.Provider, { value: { showSpinner: r, dismissSpinner: t, showing: s }, children: e });
}, fe = () => {
  const { showSpinner: e, dismissSpinner: o } = g(N);
  return { showSpinner: e, dismissSpinner: o };
}, De = () => {
  const { showing: e } = g(N);
  return { showing: e };
}, ge = ({
  appConfig: e,
  children: o
}) => /* @__PURE__ */ u(pe, { children: /* @__PURE__ */ u(me, { children: /* @__PURE__ */ u(Y, { appConfig: e, children: /* @__PURE__ */ u(ue, { children: /* @__PURE__ */ u(le, { children: /* @__PURE__ */ u(he, { children: o }) }) }) }) }) }), Ce = (e, o, n, r, t, s) => {
  if (window.location.pathname === e) {
    const i = new URLSearchParams(window.location.search);
    if (i.get("auth-redirect") !== null && i.get("code") !== null) {
      window.history.replaceState({}, "", window.location.pathname);
      const c = i.get("code");
      c && (o(), r(c).then(() => {
        s && t(s.LOGIN_SUCCESSFUL);
      }).catch(() => {
        s && t(s.LOGIN_FAILED);
      }).finally(() => {
        n();
      }));
    }
  }
}, _e = () => {
  const {
    appConfig: { appBasePath: e, appMessages: o }
  } = L(), { showMessage: n } = x(), { showSpinner: r, dismissSpinner: t } = fe(), { loginWithAuthorizationCode: s } = A();
  m(() => {
    Ce(
      e,
      r,
      t,
      s,
      n,
      o
    );
  }, [
    e,
    r,
    t,
    s,
    n,
    o
  ]);
}, we = () => (_e(), null), Ue = ({ appConfig: e, routes: o, children: n }) => /* @__PURE__ */ R(ge, { appConfig: e, children: [
  /* @__PURE__ */ u(we, {}),
  /* @__PURE__ */ R($, { children: [
    n,
    /* @__PURE__ */ u(M, { children: o.map((r) => /* @__PURE__ */ u(
      B,
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
  appRegion: n,
  appUserPoolId: r,
  appUserPoolDomain: t,
  appClientId: s,
  appIdentityPoolId: i,
  appRefreshTokenStorageKey: c,
  appLogoUrl: a,
  appMessages: d,
  hideLogin: l
}) => {
  const p = `https://${t}.auth.${n}.amazoncognito.com`, C = `${e}${o}?auth-redirect`, S = `${p}/oauth2/token`, v = `${p}/login?client_id=${s}&response_type=code&scope=email+openid+profile&redirect_uri=${C}`;
  return {
    appBasePath: o,
    appRegion: n,
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
}, ke = (e) => {
  const {
    appConfig: { appMessages: o, hideLogin: n, appExternalLoginUrl: r }
  } = L(), { showMessage: t } = x(), {
    user: { name: s },
    logoff: i
  } = A(), c = H(), a = () => {
    i().then(() => t(o.LOGOUT_SUCCESSFUL)).catch(() => t(o.LOGOUT_FAILED));
  }, d = e.find((S) => S.path === c.pathname);
  return {
    currentRouteLabel: d ? d.label : "",
    hideLoginButton: !!s || n,
    appExternalLoginUrl: r,
    hideAccountButton: !s || n,
    userName: s,
    logoffAndShowMessage: a
  };
}, Ge = (e) => {
  const {
    appConfig: { appLogoUrl: o }
  } = L(), {
    user: { groups: n }
  } = A(), r = (s) => s ? n ? s.some(
    (i) => n.includes(i)
  ) : !1 : !0, t = e.filter((s) => !s.hideFromMenu).filter((s) => r(s.authorizedGroups));
  return { appLogoUrl: o, menuRoutes: t };
};
export {
  Ue as BaseAppScope,
  ye as makeAppConfig,
  ke as useAppBarState,
  L as useAppConfig,
  Ge as useAppDrawerState,
  Pe as useDDB,
  Ne as useLambda,
  x as useMessage,
  Re as useMessageAreaState,
  fe as useSpinner,
  De as useSpinnerAreaState,
  A as useUser
};
//# sourceMappingURL=index.js.map
