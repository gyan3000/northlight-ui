import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useRef, useState, type FormEvent } from "react";
import { expect, userEvent, within } from "storybook/test";
// Everything below is built only from the library's own components.
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  Button,
  Checkbox,
  FormField,
  Input,
  Pagination,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Slider,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSortHead,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
  Textarea,
  ToastProvider,
  useToast,
} from "../../../../packages/react/src";

const meta = {
  title: "Recipes",
  parameters: { layout: "fullscreen" },
  tags: ["!autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Login form
// ---------------------------------------------------------------------------

function LoginForm() {
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    const next: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter an email address like name@example.com.";
    if (password.length < 8) next.password = "Use at least 8 characters.";
    setErrors(next);
    setSubmitted(Object.keys(next).length === 0);
    // Send people to the first problem instead of leaving them to hunt for it.
    if (next.email) emailRef.current?.focus();
    else if (next.password) passwordRef.current?.focus();
  }

  return (
    <Box padding="6" style={{ display: "grid", placeItems: "center", minBlockSize: "100vh" }}>
      <Box as="main" padding="6" radius="lg" surface="raised" bordered style={{ inlineSize: "min(24rem, 100%)" }}>
        <form onSubmit={onSubmit} noValidate aria-labelledby="login-title">
          <Stack gap="5">
            <Stack gap="1">
              <Text as="h1" id="login-title" size="xl" weight="semibold">Sign in</Text>
              <Text tone="muted" size="sm">Welcome back. Enter your details to continue.</Text>
            </Stack>

            {submitted && <Alert tone="success" title="Signed in">Redirecting to your dashboard…</Alert>}
            {Object.keys(errors).length > 0 && (
              <Alert tone="danger" title="We couldn't sign you in">Fix the highlighted fields and try again.</Alert>
            )}

            <FormField label="Email" error={errors.email} required>
              <Input ref={emailRef} name="email" type="email" autoComplete="email" placeholder="you@example.com" />
            </FormField>
            <FormField label="Password" hint="At least 8 characters." error={errors.password} required>
              <Input ref={passwordRef} name="password" type="password" autoComplete="current-password" />
            </FormField>

            <Stack direction="row" justify="between" align="center">
              <Checkbox name="remember">Remember me</Checkbox>
              <Text asChild size="sm" weight="medium"><a href="#forgot">Forgot password?</a></Text>
            </Stack>

            <Button type="submit" size="lg">Sign in</Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
}

export const LoginFormRecipe: Story = {
  name: "Login form",
  render: () => <LoginForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Sign in" }));
    // Invalid submit: errors are announced and focus lands on the first bad field.
    await expect(await canvas.findByRole("alert")).toBeInTheDocument();
    await expect(canvas.getByLabelText(/Email/)).toHaveFocus();
    await expect(canvas.getByLabelText(/Email/)).toHaveAttribute("aria-invalid", "true");
  },
};

// ---------------------------------------------------------------------------
// Settings page
// ---------------------------------------------------------------------------

function SettingsForm() {
  const { toast } = useToast();
  return (
    <Box as="main" padding="6" style={{ maxInlineSize: "46rem", marginInline: "auto" }}>
      <Stack gap="6">
        <Stack direction="row" gap="4" align="center">
          <Avatar alt="Ada Lovelace" fallback="AL" size="lg" />
          <Stack gap="0">
            <Text as="h1" size="xl" weight="semibold">Settings</Text>
            <Text tone="muted" size="sm">Manage your profile, notifications and plan.</Text>
          </Stack>
        </Stack>

        <Tabs defaultValue="profile">
          <TabsList aria-label="Settings sections">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="plan">Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Stack gap="5">
              <FormField label="Display name" required>
                <Input defaultValue="Ada Lovelace" />
              </FormField>
              <FormField label="Bio" hint="Up to 200 characters.">
                <Textarea defaultValue="Mathematician and first programmer." />
              </FormField>
              <FormField label="Role">
                <Select defaultValue="engineer" placeholder="Choose a role">
                  <SelectItem value="engineer">Engineer</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </Select>
              </FormField>
              <Stack gap="2">
                <Text as="span" size="sm" weight="medium" id="volume-label">Notification volume</Text>
                <Slider label="Notification volume" defaultValue={[60]} aria-labelledby="volume-label" />
              </Stack>
            </Stack>
          </TabsContent>

          <TabsContent value="notifications">
            <Stack gap="4">
              <Switch defaultChecked>Email me about new activity</Switch>
              <Switch>Send a weekly summary</Switch>
              <Switch defaultChecked>Product updates and tips</Switch>
            </Stack>
          </TabsContent>

          <TabsContent value="plan">
            <RadioGroup aria-label="Plan" defaultValue="pro">
              <Radio value="free">Free: 3 projects</Radio>
              <Radio value="pro">Pro: unlimited projects</Radio>
              <Radio value="team" disabled>Team (coming soon)</Radio>
            </RadioGroup>
          </TabsContent>
        </Tabs>

        <Stack direction="row" gap="3" justify="end">
          <Button variant="outline">Cancel</Button>
          <Button onClick={() => toast({ title: "Settings saved", description: "Your changes are live.", tone: "success" })}>
            Save changes
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export const SettingsPageRecipe: Story = {
  name: "Settings page",
  render: () => (
    <ToastProvider closeLabel="Close" viewportLabel="Notifications">
      <SettingsForm />
    </ToastProvider>
  ),
};

// ---------------------------------------------------------------------------
// Data table page
// ---------------------------------------------------------------------------

const invoices = Array.from({ length: 23 }, (_, i) => ({
  id: `INV-${String(i + 1).padStart(3, "0")}`,
  customer: ["Acme Corp", "Globex", "Initech", "Umbrella", "Hooli", "Stark Industries"][i % 6]!,
  amount: 300 + ((i * 377) % 4200),
  status: (["Paid", "Pending", "Overdue"] as const)[i % 3]!,
}));
const tone = { Paid: "success", Pending: "warning", Overdue: "danger" } as const;
const PAGE_SIZE = 6;
type SortKey = "id" | "customer" | "amount";

function InvoicesPage() {
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState<{ key: SortKey; direction: "ascending" | "descending" }>({ key: "id", direction: "ascending" });
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const filtered = invoices.filter((r) => status === "all" || r.status === status);
    const sorted = [...filtered].sort((a, b) => (a[sort.key] > b[sort.key] ? 1 : a[sort.key] < b[sort.key] ? -1 : 0));
    return sort.direction === "ascending" ? sorted : sorted.reverse();
  }, [status, sort]);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const visible = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const dir = (key: SortKey) => (sort.key === key ? sort.direction : "none");
  const toggle = (key: SortKey) => {
    setSort((s) => ({ key, direction: s.key === key && s.direction === "ascending" ? "descending" : "ascending" }));
    setPage(1);
  };

  return (
    <Box as="main" padding="6" style={{ maxInlineSize: "60rem", marginInline: "auto" }}>
      <Stack gap="5">
        <Breadcrumb label="Breadcrumb">
          <BreadcrumbItem><BreadcrumbLink href="#home">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbItem><BreadcrumbLink href="#billing">Billing</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbItem><BreadcrumbPage>Invoices</BreadcrumbPage></BreadcrumbItem>
        </Breadcrumb>

        <Stack direction="row" justify="between" align="end" wrap>
          <Stack gap="1">
            <Text as="h1" size="xl" weight="semibold">Invoices</Text>
            <Text tone="muted" size="sm" aria-live="polite">{rows.length} invoices</Text>
          </Stack>
          <div style={{ inlineSize: "12rem" }}>
            <FormField label="Status">
              <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </Select>
            </FormField>
          </div>
        </Stack>

        <Table label="Invoices">
          <TableCaption>Showing {visible.length} of {rows.length} invoices</TableCaption>
          <TableHeader>
            <TableRow>
              <TableSortHead direction={dir("id")} onSort={() => toggle("id")}>Invoice</TableSortHead>
              <TableSortHead direction={dir("customer")} onSort={() => toggle("customer")}>Customer</TableSortHead>
              <TableHead>Status</TableHead>
              <TableSortHead direction={dir("amount")} onSort={() => toggle("amount")}>Amount</TableSortHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((row) => (
              <TableRow key={row.id}>
                <TableHead scope="row">{row.id}</TableHead>
                <TableCell>{row.customer}</TableCell>
                <TableCell><Badge tone={tone[row.status]} size="sm">{row.status}</Badge></TableCell>
                <TableCell>${row.amount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Stack direction="row" justify="end">
          <Pagination
            pageCount={pageCount}
            page={Math.min(page, pageCount)}
            onPageChange={setPage}
            label="Pagination"
            previousLabel="Previous page"
            nextLabel="Next page"
            pageLabel={(p) => `Page ${p}`}
          />
        </Stack>
      </Stack>
    </Box>
  );
}

export const DataTablePageRecipe: Story = {
  name: "Data table page",
  render: () => <InvoicesPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Page 2" }));
    await expect(canvas.getByRole("button", { name: "Page 2" })).toHaveAttribute("aria-current", "page");
    await userEvent.click(canvas.getByRole("button", { name: "Invoice" }));
    await expect(canvas.getByRole("columnheader", { name: "Invoice" })).toHaveAttribute("aria-sort", "descending");
  },
};
