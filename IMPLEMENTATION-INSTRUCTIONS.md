# 🚀 Implementation Instructions - CORS Preflight Fix

## Problem
OPTIONS preflight requests are returning 204 No Content instead of 200 OK, which may be blocking email submission in your Figma/Make environment.

## Solution
Replace the CORS configuration in your Supabase function with an explicit OPTIONS handler that ensures 200 OK responses.

---

## Step-by-Step Implementation

### 1️⃣ Navigate to Make Supabase Function
- Go to your **Make** project
- Find the **Supabase Edge Function** editor
- Open the `/make-server-565cb7e7` function file

### 2️⃣ Find Line 40
Look for these lines (around line 40):
```typescript
// Middleware
app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));
app.use("*", logger(console.log));
```

### 3️⃣ Replace with This Complete Block
```typescript
// Middleware
app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

// Explicit OPTIONS handler to ensure 200 response for preflight
app.options("*", (c) => {
  return c.text("OK", 200);
});

app.use("*", logger(console.log));
```

### 4️⃣ Save and Redeploy
- Click **Save** in your Make/Supabase editor
- **Wait for deployment** to complete (you should see a confirmation message)
- Do NOT refresh the page during deployment

### 5️⃣ Test the Fix

**Option A: Via Network Tab**
1. Open your Figma/Make app in browser
2. Open **DevTools** → **Network** tab
3. Try to send an email
4. Look for the OPTIONS request to `/make-server-565cb7e7/download-logs`
5. Verify it returns **200 OK** (previously was 204)

**Option B: Via Console**
1. Open DevTools → **Console**
2. You should NOT see: "Datadog Browser SDK: No storage available"
3. You should NOT see: "Statsig is not ready to log exposures"

---

## What This Fix Does

1. **CORS Middleware** - Allows requests from any origin with proper headers
2. **OPTIONS Handler** - Explicitly returns 200 OK for preflight requests (not 204)
3. **Storage Polyfill** - (Already done in main.tsx) Provides memory-based storage when localStorage is blocked

---

## If It's Still Not Working

### Checklist
- [ ] Did you copy the ENTIRE block (all 6 lines including the OPTIONS handler)?
- [ ] Did you wait for the Make deployment to complete?
- [ ] Did you do a **hard refresh** in the browser (Ctrl+Shift+R or Cmd+Shift+R)?
- [ ] Are you looking at the Network tab for the request to `/download-logs` endpoint?

### Contact Points
If still stuck, verify:
1. Your Supabase function is actually updated (copy-paste the code back to confirm)
2. Make shows "Deployment Successful" after saving
3. The endpoint URL in Figma matches the one in your Make configuration

---

## Reference Code
**File:** `/supabase/functions/server/index.tsx`  
**Lines:** 39-49 (CORS + OPTIONS handler)

```typescript
// Middleware
app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

// Explicit OPTIONS handler to ensure 200 response for preflight
app.options("*", (c) => {
  return c.text("OK", 200);
});

app.use("*", logger(console.log));
```

---

## Next Steps After Deployment
1. ✅ Verify OPTIONS returns 200 in Network tab
2. ✅ Send a test email from Figma/Make
3. ✅ Check that email arrives in inbox
4. ✅ Verify no Datadog/Statsig errors in console

You should be good to go! 🎉
