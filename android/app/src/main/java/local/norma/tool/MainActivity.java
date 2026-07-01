package local.norma.tool;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        registerPlugin(HoyolabAuthPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
