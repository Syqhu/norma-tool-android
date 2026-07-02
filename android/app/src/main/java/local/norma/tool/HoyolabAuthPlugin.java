package local.norma.tool;

import android.app.Dialog;
import android.graphics.Color;
import android.view.Gravity;
import android.view.ViewGroup;
import android.view.Window;
import android.webkit.CookieManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "HoyolabAuth")
public class HoyolabAuthPlugin extends Plugin {
    private static final String LOGIN_URL = "https://act.hoyolab.com/app/zzz-game-record/index.html?lang=ja-jp";
    private static final String[] COOKIE_URLS = new String[] {
        "https://act.hoyolab.com",
        "https://www.hoyolab.com",
        "https://sg-act-public-api.hoyolab.com",
        "https://api-os-takumi.hoyolab.com",
        "https://api-os-takumi.hoyoverse.com"
    };

    @PluginMethod
    public void login(PluginCall call) {
        getActivity().runOnUiThread(() -> showLoginDialog(call));
    }

    @PluginMethod
    public void status(PluginCall call) {
        call.resolve(cookieState());
    }

    @PluginMethod
    public void disconnect(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            CookieManager manager = CookieManager.getInstance();
            manager.removeAllCookies(value -> {
                manager.flush();
                call.resolve(cookieState());
            });
        });
    }

    private void showLoginDialog(PluginCall call) {
        Dialog dialog = new Dialog(getActivity());
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);

        LinearLayout root = new LinearLayout(getActivity());
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(Color.rgb(8, 5, 18));

        LinearLayout bar = new LinearLayout(getActivity());
        bar.setGravity(Gravity.CENTER_VERTICAL);
        bar.setPadding(20, 12, 20, 12);
        bar.setBackgroundColor(Color.rgb(17, 10, 34));

        TextView title = new TextView(getActivity());
        title.setText("HoYoLAB Login");
        title.setTextColor(Color.WHITE);
        title.setTextSize(16);
        title.setGravity(Gravity.CENTER_VERTICAL);
        LinearLayout.LayoutParams titleParams = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1);
        bar.addView(title, titleParams);

        Button back = new Button(getActivity());
        back.setText("Back");
        bar.addView(back, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        Button reload = new Button(getActivity());
        reload.setText("Reload");
        bar.addView(reload, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        Button close = new Button(getActivity());
        close.setText("Done");
        bar.addView(close, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        WebView webView = new WebView(getActivity());
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setUserAgentString(settings.getUserAgentString() + " norma-tool-android");

        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(webView, true);

        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl(LOGIN_URL);

        root.addView(bar, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        root.addView(webView, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1));

        dialog.setContentView(root);
        dialog.setOnDismissListener(d -> {
            cookieManager.flush();
            call.resolve(cookieState());
        });
        back.setOnClickListener(v -> {
            if (webView.canGoBack()) {
                webView.goBack();
            }
        });
        reload.setOnClickListener(v -> webView.reload());
        close.setOnClickListener(v -> dialog.dismiss());
        dialog.show();
        Window shown = dialog.getWindow();
        if (shown != null) {
            shown.setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        }
    }

    private JSObject cookieState() {
        String header = cookieHeader();
        JSObject result = new JSObject();
        result.put("loggedIn", hasLoginCookie(header));
        result.put("cookieCount", cookieCount(header));
        result.put("cookieHeader", header);
        result.put("hasLToken", header.contains("ltoken") || header.contains("ltoken_v2"));
        result.put("hasCookieToken", header.contains("cookie_token") || header.contains("cookie_token_v2"));
        return result;
    }

    private String cookieHeader() {
        CookieManager manager = CookieManager.getInstance();
        StringBuilder builder = new StringBuilder();
        for (String url : COOKIE_URLS) {
            String raw = manager.getCookie(url);
            if (raw == null || raw.trim().isEmpty()) continue;
            String[] parts = raw.split(";");
            for (String part : parts) {
                String cookie = part.trim();
                if (cookie.isEmpty()) continue;
                if (builder.indexOf(cookie.split("=")[0] + "=") >= 0) continue;
                if (builder.length() > 0) builder.append("; ");
                builder.append(cookie);
            }
        }
        return builder.toString();
    }

    private boolean hasLoginCookie(String header) {
        return header.contains("ltoken=")
            || header.contains("ltoken_v2=")
            || header.contains("cookie_token=")
            || header.contains("cookie_token_v2=");
    }

    private int cookieCount(String header) {
        if (header == null || header.trim().isEmpty()) return 0;
        return header.split(";").length;
    }
}
